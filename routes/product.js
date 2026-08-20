const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  console.log('🟢 FULL REQUEST QUERY:', req.query);

  try {
    const { category, subCategory, q, limit = 8, page = 1, sort, maxPrice, gender } = req.query;
    let filters = [];

    if (category) {
      if (category === 'Outlet') {
        filters.push({ category: 'Outlet' });
      } 
      else if (category === 'Men' || category === 'Women') {
        const shoeSubs = ['Sneaker', 'Running Shoe', 'Casual Shoe', 'Formal Shoe', 'Loafer', 'Boot', 'Sandal'];
        if (subCategory && shoeSubs.includes(subCategory)) {
          filters.push({ category: 'Shoes' });
        } 
        else {
          filters.push({ category });
        }
      } 
      else if (category === 'Shoes') {
        if (subCategory) {
          filters.push({
            $or: [
              { category: 'Shoes' },
              { category: 'Outlet', subCategory: { $regex: new RegExp(`^${subCategory}$`, 'i') } }
            ]
          });
        } else {
          filters.push({ category: 'Shoes' });
        }
      }
      else {
        filters.push({ category });
      }
    }

    if (subCategory) {
      filters.push({
        subCategory: { $regex: new RegExp(`^${subCategory}$`, 'i') }
      });
    }

    if (gender && ['Men', 'Women', 'Unisex'].includes(gender)) {
      filters.push({ gender });
    }

    if (q) {
      filters.push({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ]
      });
    }

    if (maxPrice) {
      filters.push({ price: { $lte: Number(maxPrice) } });
    }

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

    const products = await Product.find(query)
      .select('title price images category subCategory gender discountPercent inStock')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.json({ products, totalCount, currentPage: parseInt(page), totalPages: Math.ceil(totalCount / parseInt(limit)) });
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
    const { 
      title, 
      price, 
      description, 
      images, 
      category, 
      subCategory, 
      sport,
      discountPercent,
      gender,
      inStock 
    } = req.body;

    const newProduct = new Product({ 
      title, 
      price, 
      description, 
      images, 
      category, 
      subCategory, 
      sport: sport || 'Running',
      discountPercent: discountPercent || 0,
      gender: gender || 'Unisex',
      inStock 
    });
    
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
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { returnDocument: 'after' }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating product' });
  }
});

module.exports = router;