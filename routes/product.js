const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET: Products fetch karo (Backend Filtering + Pagination)
router.get('/', async (req, res) => {
  console.log('🟢 FULL REQUEST QUERY:', req.query);

  try {
    const { category, q, limit = 8, page = 1 } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // 🟢 Pagination Logic (Skip calculate karo)
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Total count nikal lo (Load More button chhupane ke liye)
    const totalCount = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      products,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// GET: Single product by ID
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
    
    // 🔥 YAHAN LOG ADD KIYA HAI
    console.log('🟢 POST /api/products received:', { title, images });

    const newProduct = new Product({ title, price, description, images, category, inStock });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('🔥 ERROR in POST /api/products:', error);
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
    // 🔥 YAHAN LOG ADD KIYA HAI
    console.log('🟡 PUT /api/products/' + req.params.id, req.body);

    // 🔥 FIX: 'new: true' ki jagah 'returnDocument: 'after'' use kiya
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { returnDocument: 'after' } 
    );
    res.json(updatedProduct);
  } catch (error) {
    console.error('🔥 ERROR in PUT /api/products:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

module.exports = router;
