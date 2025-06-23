const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Product = require('./models/Product');
const checkStock = require('./utils/checkStock');
const { CognitoJwtVerifier } = require('aws-jwt-verify');
const { sendInStockEmail } = require('./utils/notify');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  clientId:   process.env.AWS_COGNITO_USER_POOL_CLIENT_ID,
  tokenUse:   'id',  
});

async function authMiddleware(req, res, next) {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); 
  }

  try {
    const header = req.headers.authorization || '';
    const token  = header.split(' ')[1] || '';
    const payload = await verifier.verify(token);
    req.user = { sub: payload.sub, email: payload.email };
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
}

app.use('/api/products', authMiddleware);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/api/products', async (req, res) => {
  try {
    const { url } = req.body;
    const newProduct = new Product({
      url,
      inStock:     false,
      lastChecked: new Date(),
      userId:      req.user.sub,
      email: req.user.email,
    });
    const saved = await newProduct.save();
    res.json(saved);
  } catch (err) {
    console.error('Error creating product:', err.message);
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const filter = { userId: req.user.sub };
    if (req.query.inStock !== undefined) {
      filter.inStock = req.query.inStock === 'true';
    }
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ error: 'Failed to get products.' });
  }
});

app.post('/api/products/:id/check', async (req, res) => {
  try {
    const product = await Product.findOne({
      _id:    req.params.id,
      userId: req.user.sub,
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const result = await checkStock(product.url);
    if (!result) return res.status(500).json({ error: 'Stock check failed' });

    product.inStock     = result.inStock;
    product.lastChecked = result.lastChecked;
    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Error checking stock:', err.message);
    res.status(500).json({ error: 'Failed to check stock.' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      _id:    req.params.id,
      userId: req.user.sub,
    });
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  app.listen(3001, '0.0.0.0', () => {
    console.log('API listening on http://0.0.0.0:3001');
  });
});

async function runStockCheckForAllUsers() {
  try {
    const products = await Product.find();
    console.log(`Checking ${products.length} products for stock…`);

    for (const product of products) {
      const oldStatus = product.inStock;          
      const result    = await checkStock(product.url);
      if (!result) {
        console.warn(`⚠️  Failed to check ${product.url}`);
        continue;
      }

      product.inStock     = result.inStock;
      product.lastChecked = result.lastChecked;
      await product.save();

      if (!oldStatus && result.inStock) {
        await sendInStockEmail(product.email, product.url);
        console.log(`✉️  Alert sent to ${product.email} for ${product.url}`);
      } else {
        console.log(`Updated ${product.url} — inStock = ${result.inStock}`);
      }
    }
  } catch (err) {
    console.error('Error in background stock check:', err.message);
  }
}

setInterval(runStockCheckForAllUsers, 15000); // every 15 seconds

app.delete('/api/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.sub,
    });
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});
