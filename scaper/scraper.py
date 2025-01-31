import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import json
import re


class ZenWebsiteScraper:
    def __init__(self, url):
        self.url = url
        self.driver = self._setup_driver()

    def _setup_driver(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=chrome_options
        )
        return driver

    def scroll_and_scrape(self, max_scrolls=10, scroll_pause_time=2):
        self.driver.get(self.url)
        time.sleep(3)  # Initial page load

        # Get scroll height
        last_height = self.driver.execute_script(
            "return document.body.scrollHeight")
        products = []  # Changed to list

        for _ in range(max_scrolls):
            # Scroll down to bottom
            self.driver.execute_script(
                "window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(scroll_pause_time)

            # Wait for new products to load
            try:
                new_product_divs = self.driver.find_elements(
                    By.CSS_SELECTOR, 'div.single-products-box')

                # Extract product details
                for div in new_product_divs:
                    product = self._extract_product_details(div)
                    if product:
                        # Check if the product is already in the list based on its link
                        if not any(p['product_link'] == product['product_link'] for p in products):
                            products.append(product)

            except Exception as e:
                print(f"Error during scrolling: {e}")

            # Calculate new scroll height and compare with last scroll height
            new_height = self.driver.execute_script(
                "return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

        return products

    def _extract_product_details(self, div):
        try:
            # Name
            name_elem = div.find_element(By.CSS_SELECTOR, 'h3 a')
            name = name_elem.text

            # Image URL
            img_elem = div.find_element(By.CSS_SELECTOR, 'img')
            image_url = img_elem.get_attribute('src')

            # Prices - multiple strategies to find price
            try:
                price_elements = [
                    div.find_elements(By.CSS_SELECTOR, '.new-price'),
                    div.find_elements(By.CSS_SELECTOR, '.prices-zone strong'),
                    div.find_elements(
                        By.XPATH, ".//*[contains(text(), 'TND')]")
                ]

                price_text = None
                for elements in price_elements:
                    if elements:
                        price_text = elements[0].text
                        break

                if not price_text:
                    raise ValueError("No price found")

                # Extract prices using regex
                prices = re.findall(
                    r'(\d+\.\d+)', price_text.replace(' TND', ''))

                if len(prices) >= 2:
                    new_price = float(prices[0])
                    old_price = float(prices[1])
                elif len(prices) == 1:
                    new_price = float(prices[0])
                    old_price = None
                else:
                    raise ValueError(
                        f"Could not parse prices from: {price_text}")

            except Exception as price_error:
                print(f"Price extraction error: {price_error}")
                new_price = None
                old_price = None

            # Colors
            try:
                color_elem = div.find_element(By.CSS_SELECTOR, '.more-colors')
                colors = color_elem.text
            except:
                colors = "N/A"

            # Product Link
            link_elem = div.find_element(By.CSS_SELECTOR, 'a.d-block')
            product_link = link_elem.get_attribute('href')

            return {
                'name': name,
                'image_url': image_url,
                'new_price': new_price,
                'old_price': old_price,
                'colors': colors,
                'product_link': product_link
            }

        except Exception as e:
            print(f"Error extracting product details: {e}")
            return None

    def save_to_json(self, products, filename='zen_products.json'):
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(list(products), f, ensure_ascii=False, indent=4)

    def close(self):
        self.driver.quit()

# Usage example


def main():
    url = 'https://www.zen.com.tn/fr/tn/169-soldes-homme'
    scraper = ZenWebsiteScraper(url)

    try:
        # Increase scrolls to load more products
        products = scraper.scroll_and_scrape(max_scrolls=20)
        scraper.save_to_json(products)
        print(f"Scraped {len(products)} unique products")
    finally:
        scraper.close()


if __name__ == '__main__':
    main()
