package com.example.webcrawler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync // Enable Spring's ability to run @Async methods in the background
public class WebcrawlerApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebcrawlerApplication.class, args);
    }

}
