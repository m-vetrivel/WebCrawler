import { useState, useEffect } from "react";

// The CSS styles have been updated for a more attractive and modern look.
const styles = `
:root {
  /* Vibrant Color Palette */
  --primary-color: #0891b2; /* Cyan-600 */
  --primary-hover: #06b6d4; /* Cyan-500 */
  --background-gradient-start: #111827; /* Gray-900 */
  --background-gradient-end: #1e1b4b;   /* Indigo-950 */
  --card-background: rgba(255, 255, 255, 0.9);
  --card-border: rgba(255, 255, 255, 0.1);
  --shadow-color: rgba(0, 0, 0, 0.3);
  --glow-color: rgba(20, 184, 166, 0.2); /* Teal glow */
  --text-dark: #0f172a; /* Slate-900 */
  --text-light: #64748b; /* Slate-500 */
  --input-border: #cbd5e1; /* Slate-300 */
  --success-bg: #d1fae5;
  --success-text: #065f46;
  --error-bg: #fee2e2;
  --error-text: #991b1b;
}

/* Basic CSS Reset for layout correction */
*, *::before, *::after {
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
}

.app-container {
  min-height: 100vh;
  width: 100vw;
  padding: 2rem;
  display: grid; /* Changed from flex for more robust centering */
  place-items: center; /* This centers the child element both horizontally and vertically */
  background-image: linear-gradient(to bottom right, var(--background-gradient-start), var(--background-gradient-end));
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  overflow-y: auto;
}

.crawler-card {
  width: 100%;
  max-width: 42rem;
  background-color: var(--card-background);
  backdrop-filter: blur(16px);
  border-radius: 1.25rem;
  padding: 2.5rem;
  box-shadow: 0 25px 50px -12px var(--shadow-color), 0 0 15px 0 var(--glow-color);
  border: 1px solid var(--card-border);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: floatIn 0.8s ease-out forwards;
}

@keyframes floatIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-header { text-align: center; }
.card-header h1 { font-size: 2.25rem; font-weight: bold; color: var(--text-dark); margin: 0; }
.card-header p { margin-top: 0.5rem; color: var(--text-light); font-size: 1rem; }

.crawler-form { display: flex; flex-direction: column; gap: 1.5rem; }
.form-group { display: flex; flex-direction: column; }
.form-group label { margin-bottom: 0.5rem; font-weight: 500; color: var(--text-dark); }

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--input-border);
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.2s ease-in-out;
  background-color: #fff;
  color: var(--text-dark); /* Explicitly set text color */
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.2);
}

.form-textarea { resize: vertical; min-height: 80px; }
.form-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }

@media (min-width: 768px) {
  .form-grid { grid-template-columns: 1fr 1fr; }
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: var(--primary-color);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  transform-origin: center;
}

.submit-btn:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: scale(1.03) translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(8, 145, 178, 0.4);
}

.submit-btn:disabled { background-color: #9ca3af; cursor: not-allowed; }

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.75rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.message-box { 
  margin-top: 1rem; 
  padding: 1rem; 
  border-radius: 0.5rem; 
  font-weight: 500; 
  font-size: 0.9rem; 
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.message-box.success { background-color: var(--success-bg); color: var(--success-text); }
.message-box.error { background-color: var(--error-bg); color: var(--error-text); }
`;

const sitePresets = {
  custom: {
    name: "Custom Configuration",
    baseUrl: "",
    urls: "",
    productContainerSelector: "",
    productNameSelector: "",
    priceSelector: "",
  },
  webscraper: {
    name: "Web Scraper Test Site",
    baseUrl: "https://webscraper.io/test-sites",
    urls: "https://webscraper.io/test-sites/e-commerce/allinone",
    productContainerSelector: ".thumbnail",
    productNameSelector: ".title",
    priceSelector: ".price",
  },
  books: {
    name: "Books to Scrape",
    baseUrl: "http://books.toscrape.com",
    urls: "http://books.toscrape.com/catalogue/category/books_1/index.html",
    productContainerSelector: "article.product_pod",
    productNameSelector: "h3 > a",
    priceSelector: ".price_color",
  },
  scrapingClub: {
    name: "Scraping Club Store",
    baseUrl: "https://scrapingclub.com",
    urls: "https://scrapingclub.com/exercise/list_basic/",
    productContainerSelector: ".card",
    productNameSelector: "h4 > a",
    priceSelector: "h5",
  },
  gadgetGrove: {
    name: "Gadget Grove (Fictional)",
    baseUrl: "https://example.com",
    urls: "https://example.com/gadgets",
    productContainerSelector: ".product-item",
    productNameSelector: ".product-name",
    priceSelector: ".product-price",
  },
};

const defaultPresetKey = "webscraper";
const defaultPreset = sitePresets[defaultPresetKey];

function App() {
  const [selectedPresetKey, setSelectedPresetKey] = useState(defaultPresetKey);
  const [baseUrl, setBaseUrl] = useState(defaultPreset.baseUrl);
  const [urls, setUrls] = useState(defaultPreset.urls);
  const [productContainerSelector, setProductContainerSelector] = useState(defaultPreset.productContainerSelector);
  const [productNameSelector, setProductNameSelector] = useState(defaultPreset.productNameSelector);
  const [priceSelector, setPriceSelector] = useState(defaultPreset.priceSelector);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // This function now directly handles preset changes, replacing the useEffect hook.
  const handlePresetChange = (key) => {
    const preset = sitePresets[key];
    if (preset) {
      setSelectedPresetKey(key);
      setBaseUrl(preset.baseUrl);
      setUrls(preset.urls);
      setProductContainerSelector(preset.productContainerSelector);
      setProductNameSelector(preset.productNameSelector);
      setPriceSelector(preset.priceSelector);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const urlList = urls.split("\n").map(u => u.trim()).filter(u => u);

    const payload = {
      baseUrl,
      urls: urlList,
      productContainerSelector,
      productNameSelector,
      priceSelector,
    };

    try {
      const response = await fetch("http://localhost:8080/api/crawler/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.text();
      setMessage(data);
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        <div className="crawler-card">
          <header className="card-header">
            <h1>Product Web Crawler</h1>
            <p>Automate your data scraping with ease.</p>
          </header>

          <form onSubmit={handleSubmit} className="crawler-form">
            <div className="form-group">
              <label htmlFor="preset">Configuration Preset</label>
              <select
                id="preset"
                value={selectedPresetKey}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="form-select"
              >
                {Object.keys(sitePresets).map(key => (
                  <option key={key} value={key}>
                    {sitePresets[key].name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="baseUrl">Base URL (Crawler will stay on this domain)</label>
              <input
                id="baseUrl" type="text" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)}
                className="form-input" placeholder="https://www.example.com" required
              />
            </div>

            <div className="form-group">
              <label htmlFor="urls">Start URLs (one per line)</label>
              <textarea
                id="urls" value={urls} onChange={(e) => setUrls(e.target.value)}
                className="form-textarea" placeholder="https://www.example.com/products" required
              />
            </div>

            <div className="form-group">
              <label htmlFor="productContainerSelector">Product Container Selector</label>
              <input
                id="productContainerSelector" type="text" value={productContainerSelector} onChange={(e) => setProductContainerSelector(e.target.value)}
                className="form-input" placeholder="e.g., .product-card or .thumbnail" required
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="productNameSelector">Product Name Selector</label>
                <input
                  id="productNameSelector" type="text" value={productNameSelector} onChange={(e) => setProductNameSelector(e.target.value)}
                  className="form-input" placeholder="e.g., .title or h2" required
                />
              </div>
              <div className="form-group">
                <label htmlFor="priceSelector">Price Selector</label>
                <input
                  id="priceSelector" type="text" value={priceSelector} onChange={(e) => setPriceSelector(e.target.value)}
                  className="form-input" placeholder="e.g., .price or .product-cost" required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading && <div className="spinner"></div>}
              {isLoading ? "Crawling..." : "Start Crawl"}
            </button>
          </form>

          {message && (
            <div className={`message-box ${message.startsWith("Error:") ? "error" : "success"}`}>
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;

