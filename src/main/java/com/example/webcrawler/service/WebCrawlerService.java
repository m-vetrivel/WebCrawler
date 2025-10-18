package com.example.webcrawler.service;

import com.example.webcrawler.model.Product;
import com.example.webcrawler.util.FileUtil;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.*;

@Service
public class WebCrawlerService {

    private final ExecutorService executor = Executors.newFixedThreadPool(10); // Increased pool size
    private final Set<String> visitedUrls = ConcurrentHashMap.newKeySet();
    private final BlockingQueue<Product> productsQueue = new LinkedBlockingQueue<>();

    /**
     * Main crawl method, annotated with @Async to run in a separate thread.
     * This method orchestrates the crawling process.
     */
    @Async
    public void crawl(String baseUrl, List<String> startUrls, String containerSelector, String nameSelector, String priceSelector, String outputFile) {
        // Clear previous results for a new crawl session
        visitedUrls.clear();
        productsQueue.clear();

        CountDownLatch latch = new CountDownLatch(startUrls.size());

        for (String url : startUrls) {
            submitCrawlTask(url, baseUrl, containerSelector, nameSelector, priceSelector, latch);
        }

        try {
            // Wait for initial tasks to complete before starting the file writer
            latch.await(5, TimeUnit.MINUTES);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Crawl was interrupted.");
        }

        // Start a separate thread to write products to the file as they are found
        Future<?> fileWriterFuture = executor.submit(() -> FileUtil.saveProducts(productsQueue, outputFile, executor));

        // Wait for the file writing to complete
        try {
            fileWriterFuture.get();
        } catch (InterruptedException | ExecutionException e) {
            System.err.println("Error during file writing process: " + e.getMessage());
        } finally {
            // Shutdown the executor when everything is done
            executor.shutdown();
        }
        System.out.println("Crawling finished.");
    }

    /**
     * Submits a single URL to be crawled by the executor service.
     */
    private void submitCrawlTask(String url, String baseUrl, String containerSelector, String nameSelector, String priceSelector, CountDownLatch latch) {
        if (url != null && url.startsWith(baseUrl) && visitedUrls.add(url)) {
            executor.submit(() -> {
                try {
                    processUrl(url, baseUrl, containerSelector, nameSelector, priceSelector, latch);
                } finally {
                    if (latch != null) {
                        latch.countDown();
                    }
                }
            });
        }
    }

    /**
     * Processes a single URL: fetches HTML, extracts products, and finds new links.
     */
    private void processUrl(String url, String baseUrl, String containerSelector, String nameSelector, String priceSelector, CountDownLatch latch) {
        try {
            Document doc = Jsoup.connect(url).timeout(10000).get();

            // 1. Extract Products using the more robust container-based approach
            Elements productContainers = doc.select(containerSelector);
            for (Element container : productContainers) {
                String name = container.select(nameSelector).first().text();
                String price = container.select(priceSelector).first().text();
                // Add the found product to the thread-safe queue
                productsQueue.offer(new Product(name, price, url));
            }

            // 2. Discover and crawl new links
            Elements links = doc.select("a[href]");
            for (Element link : links) {
                String newUrl = link.absUrl("href");
                // Recursively submit new tasks for discovered links within the same domain
                submitCrawlTask(newUrl, baseUrl, containerSelector, nameSelector, priceSelector, null);
            }

        } catch (IOException e) {
            System.err.println("Error processing URL " + url + ": " + e.getMessage());
        }
    }
}
