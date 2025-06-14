// testCheckStock.js
const checkStock = require('./utils/checkStock');

(async () => {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node testCheckStock.js <product-URL>');
    process.exit(1);
  }
  console.log('Checking stock for:', url);
  const result = await checkStock(url);
  if (!result) {
    console.error('checkStock returned null or threw an error.');
    process.exit(1);
  }
  console.log('Result:', result);
  // debug.png will have the screenshot Puppeteer took
})();