const axios = require('axios');
const cheerio = require('cheerio');

async function checkStock(url) {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const $ = cheerio.load(html);

    const button = $('button[data-test="addToCartButton"], button[id^="addToCartButtonOrTextFor"]');
    const isDisabled = button.attr('disabled') !== undefined;
    const outOfStockText = $('span, div')
    .filter((_, el) => $(el).text().toLowerCase().includes('out of stock'))
    .length > 0;

  const inStock = !isDisabled && !outOfStockText;

    return {
      inStock,
      lastChecked: new Date(),
    };

  } catch (err) {
    console.error('❌ Error checking stock:', err.message);
    return null;
  }
}

module.exports = checkStock;
