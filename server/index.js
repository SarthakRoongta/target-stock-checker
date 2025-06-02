const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('Server is running');
    console.log("GET / route hit");
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  app.post('/api/products', async (req, res) => {
    const { url } = req.body;
  
    if (!url) {
      return res.status(400).json({ error: 'Product URL is required' });
    }
  
    try {
      const newProduct = new Product({ url });
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (err) {
      console.error('Error saving product:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find(); 
      res.status(200).json(products);        
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });