const puppeteer = require('puppeteer');

let browser = null;

const initBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  return browser;
};

const closeBrowser = async () => {
  if (browser) {
    await browser.close();
    browser = null;
  }
};

const getPage = async () => {
  const browserInstance = await initBrowser();
  const page = await browserInstance.newPage();

  // Set user agent to avoid detection
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  return page;
};

module.exports = {
  initBrowser,
  closeBrowser,
  getPage
};
