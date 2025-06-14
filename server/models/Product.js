const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: false,
  },
  lastChecked: {
    type: Date,
    default: Date.now,
  },
  userId:{ 
    type: String,  
    required: true 
  },
});

module.exports = mongoose.model('Product', productSchema);
