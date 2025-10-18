package com.example.webcrawler.util;

import com.example.webcrawler.model.Product;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

public class FileUtil {
    /**
     * Saves products from a BlockingQueue to a CSV file.
     * This method will continue to pull products from the queue until the executor service begins to shut down.
     * @param productsQueue The queue holding the products to be written.
     * @param filename The name of the output file.
     * @param executor The executor service controlling the crawl, used to signal completion.
     */
    public static void saveProducts(BlockingQueue<Product> productsQueue, String filename, ExecutorService executor) {
        try (PrintWriter writer = new PrintWriter(new FileWriter(filename))) {
            // Write CSV header
            writer.println("Name,Price,URL");

            // Continue processing until the crawler is shutting down and the queue is empty
            while (!executor.isShutdown() || !productsQueue.isEmpty()) {
                Product product = productsQueue.poll(1, TimeUnit.SECONDS); // Wait up to 1 second for a product
                if (product != null) {
                    writer.println(
                        "\"" + product.getName().replace("\"", "\"\"") + "\"," +
                        "\"" + product.getPrice().replace("\"", "\"\"") + "\"," +
                        "\"" + product.getUrl().replace("\"", "\"\"") + "\""
                    );
                }
            }
        } catch (IOException e) {
            System.err.println("Error writing to file: " + e.getMessage());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("File writing was interrupted.");
        }
    }
}
