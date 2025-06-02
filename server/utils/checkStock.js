const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function checkStock(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
        headless: 'new', 
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--start-maximized',
      ],
    });

   const page = await browser.newPage();


    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    );

    // Spoof fingerprint
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
      Object.defineProperty(navigator, 'platform', { get: () => 'MacIntel' });
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

    // Scroll a bit to simulate a real user
    await page.evaluate(() => window.scrollBy(0, 400));

    await page.waitForSelector('button', { timeout: 8000 });


    await new Promise(resolve => setTimeout(resolve, 5000));

    await page.screenshot({ path: 'debug.png', fullPage: true });

    const inStock = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addToCartBtn = btns.find(btn =>
        btn.textContent.toLowerCase().includes('add to cart')
      );

      if (!addToCartBtn) return false;

      const isDisabled =
        addToCartBtn.disabled || addToCartBtn.getAttribute('aria-disabled') === 'true';

      return !isDisabled;
    });

    console.log('✅ inStock:', inStock);
    return {
      inStock,
      lastChecked: new Date(),
    };

  } catch (err) {
    console.error('❌ Puppeteer error:', err.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = checkStock;
