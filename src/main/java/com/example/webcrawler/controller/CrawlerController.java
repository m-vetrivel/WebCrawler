package com.example.webcrawler.controller;

import com.example.webcrawler.service.WebCrawlerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crawler")
public class CrawlerController {

    @Autowired
    private WebCrawlerService crawlerService;

    /**
     * Starts the crawling process asynchronously.
     * @param request The crawl request containing start URLs and CSS selectors.
     * @return An immediate confirmation that the crawling has started.
     */
    @PostMapping("/start")
    public String startCrawling(@RequestBody CrawlRequest request) {
        // This method will now run in the background thanks to the @Async annotation in the service
        crawlerService.crawl(
                request.getBaseUrl(),
                request.getUrls(),
                request.getProductContainerSelector(),
                request.getProductNameSelector(),
                request.getPriceSelector(),
                "products_output.csv"
        );
        return "Crawling process started in the background. Results will be saved to products_output.csv.";
    }

    /**
     * A simple data class for the incoming JSON request body.
     * This structure is more robust for crawling.
     */
    public static class CrawlRequest {
        private String baseUrl; // The base domain to stay within (e.g., "https://www.example.com")
        private List<String> urls; // The initial seed URLs
        private String productContainerSelector; // Selector for the element containing a single product
        private String productNameSelector;  // Selector for the product name, relative to the container
        private String priceSelector;      // Selector for the price, relative to the container

        // Getters and Setters
        public String getBaseUrl() { return baseUrl; }
        public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
        public List<String> getUrls() { return urls; }
        public void setUrls(List<String> urls) { this.urls = urls; }
        public String getProductContainerSelector() { return productContainerSelector; }
        public void setProductContainerSelector(String productContainerSelector) { this.productContainerSelector = productContainerSelector; }
        public String getProductNameSelector() { return productNameSelector; }
        public void setProductNameSelector(String productNameSelector) { this.productNameSelector = productNameSelector; }
        public String getPriceSelector() { return priceSelector; }
        public void setPriceSelector(String priceSelector) { this.priceSelector = priceSelector; }
    }
}
