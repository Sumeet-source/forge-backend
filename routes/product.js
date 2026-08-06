const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET: Products fetch karo (Backend Filtering)
router.get('/', async (req, res) => {
  console.log('🟢 FULL REQUEST QUERY:', req.query); // Deploy Logs mein ye print hoga

  try {
    const { category, q, limit = 50 } = req.query;
    
    // 🔥 SAFETY CHECK: Agar category URL mein nahi hai, toh error bhejo
    if (!category) {
      return res.status(400).json({ 
        message: 'Category parameter is required!', 
        receivedQuery: req.query 
      });
    }

    let query = { category: category }; // Seedha category daalo

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).limit(parseInt(limit));
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, price, description, images, category, inStock } = req.body;
    const newProduct = new Product({ title, price, description, images, category, inStock });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding product' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating product' });
  }
});

module.exports = router;
