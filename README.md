# 🚀 Multithreaded Web Crawler

Welcome! This isn't just a script; it's a dynamic, full-stack application designed to intelligently crawl e-commerce sites, discover new pages, and extract product data—all powered by a multithreaded Java backend and controlled by a sleek React interface.

I built this project to demonstrate a practical understanding of concurrent programming, API design, and modern front-end development.

![Web Crawler UI Screenshot](https://i.imgur.com/gO0X7jP.png)

---

### ✨ Core Concept

The goal was to create a tool that could quickly gather product information (like names and prices) from websites. Instead of processing pages one by one, this crawler uses a managed pool of threads (`ExecutorService`) to crawl multiple pages simultaneously. This drastically speeds up the data extraction process. The Spring Boot backend exposes a simple REST API, which the React front-end consumes to provide a seamless user experience.

---

### 🛠️ Tech Stack

A look at the technologies that bring this project to life:

| Backend         | Frontend        | Tooling & Libraries      |
| :-------------- | :-------------- | :----------------------- |
| **Java 17+** | **React.js** | **Spring Boot 3** |
| **Maven** | **Embedded CSS**| **Jsoup** (HTML Parsing) |
| `ExecutorService` | **Vite** | `ConcurrentHashMap`      |

---

### 🌟 Key Features

- **⚡ Multithreaded Crawling:** Utilizes a fixed thread pool to process multiple URLs concurrently, maximizing efficiency.
- **🔗 Automatic Link Discovery:** Intelligently finds new links (`<a>` tags) on a page and adds them to the crawling queue, enabling deep site exploration.
- **🎯 Dynamic CSS Selectors:** The user can specify the exact CSS selectors for product containers, names, and prices, making the tool adaptable to various website layouts.
- **💾 Site Presets:** Comes with pre-configured settings for popular test sites, allowing for quick-start demonstrations.
- **✅ Asynchronous API:** The REST endpoint immediately acknowledges the request and performs the long-running crawl task in the background.
- **📄 CSV Output:** All extracted data is neatly saved to a `products_output.csv` file for easy access and analysis.

---

### 🏁 Getting Started

Ready to see it in action? Here’s how to get both the backend and frontend up and running.

#### **Backend (Spring Boot)**

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-folder>
    ```
2.  **Navigate to the backend project and run it using Maven:**
    ```bash
    # From the root directory
    mvn -f pom.xml spring-boot:run
    ```
3.  The backend server will start on `http://localhost:8080`.

#### **Frontend (React)**

1.  **Navigate to the frontend directory:**
    ```bash
    # From the root directory
    cd webcrawler-frontend
    ```
2.  **Install dependencies and start the development server:**
    ```bash
    npm install
    npm run dev
    ```
3.  Open your browser and visit `http://localhost:5173` to use the application.

---

### A Little Note from Me

Building this project was a fantastic journey, from architecting a thread-safe Java service to designing a responsive and intuitive React UI. It was a great challenge to connect these two worlds into a cohesive application. Thanks for checking it out!
