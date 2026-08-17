const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  console.log('🟢 FULL REQUEST QUERY:', req.query);

  try {
    const { category, subCategory, q, limit = 8, page = 1, sort, maxPrice } = req.query;
    let filters = [];

    // 🟢 SMART CATEGORY LOGIC: Agar 'Sportswear' hai, toh Men/Women bhi include karo
    if (category) {
      if (category === 'Sportswear') {
        filters.push({
          $or: [
            { category: 'Sportswear' },
            { category: 'Men' },
            { category: 'Women' }
          ]
        });
      } else {
        filters.push({ category });
      }
    }

    // 🟢 Sub-Category filter (Case-insensitive regex)
    if (subCategory) {
      const cleanSub = subCategory.replace(/s$/i, ''); 
      filters.push({
        $or: [
          { subCategory: { $regex: new RegExp(cleanSub, 'i') } },
          { title: { $regex: new RegExp(cleanSub, 'i') } }
        ]
      });
    }

    if (q) {
      filters.push({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ]
      });
    }

    if (maxPrice) filters.push({ price: { $lte: Number(maxPrice) } });

    let query = {};
    if (filters.length > 0) {
      query = { $and: filters };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalCount = await Product.countDocuments(query);

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const products = await Product.find(query).sort(sortOption).skip(skip).limit(parseInt(limit));

    res.json({ products, totalCount, currentPage: parseInt(page), totalPages: Math.ceil(totalCount / parseInt(limit)) });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// Baaki ke routes unchanged
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
    const { title, price, description, images, category, subCategory, inStock } = req.body;
    const newProduct = new Product({ title, price, description, images, category, subCategory, inStock });
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
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating product' });
  }
});

module.exports = router;