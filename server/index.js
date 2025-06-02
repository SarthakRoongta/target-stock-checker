const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const checkStock = require('./utils/checkStock');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Create a new product URL entry
app.post('/api/products', async (req, res) => {
  try {
    const { url } = req.body;
    const newProduct = new Product({ url, inStock: false, lastChecked: new Date() });
    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (err) {
    console.error('Error creating product:', err.message);
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('❌ Error fetching products:', err.message);
    res.status(500).json({ error: 'Failed to get products.' });
  }
});

// Manually trigger stock check for a product by ID
app.post('/api/products/:id/check', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const result = await checkStock(product.url);

    if (result) {
      product.inStock = result.inStock;
      product.lastChecked = result.lastChecked;
      await product.save();
      res.json(product);
    } else {
      res.status(500).json({ error: 'Stock check failed' });
    }
  } catch (err) {
    console.error('Error checking stock:', err.message);
    res.status(500).json({ error: 'Failed to check stock.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

  /*
  curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.target.com/p/2024-pok-scarlet-violet-s8-5-elite-trainer-box/-/A-93954435#lnk=sametab"}'
  683bf0e58d12eb85a8fcf379
curl -X POST http://localhost:3001/api/products/683cfbf0d9c41417250b881c/check

  curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.target.com/p/pok-233-mon-trading-card-game-charizard-ex-super-premium-collection/-/A-91670547#lnk=sametab"}'
  683cfcaca6af6256f84cbed5

  curl -X POST http://localhost:3001/api/products/683cfcaca6af6256f84cbed5/check
  */