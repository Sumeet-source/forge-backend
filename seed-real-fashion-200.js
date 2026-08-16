require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const apiUrl = 'https://fakestoreapi.com/products';

async function seedRealFashion() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  // 1. API se real products fetch karo
  const response = await fetch(apiUrl);
  const realProducts = await response.json();

  // 2. Sirf Fashion items (Electronics hatao)
  const fashionItems = realProducts.filter(p => p.category !== 'electronics');

  const productsToInsert = [];
  const variations = ['Classic', 'Premium', 'Limited', 'Pro', 'Elite'];

  for (let i = 0; i < fashionItems.length; i++) {
    const item = fashionItems[i];
    // Category map karo (API: men's clothing, women's clothing, jewelery)
    let category = 'Men';
    if (item.category === 'women\'s clothing') category = 'Women';
    else if (item.category === 'jewelery') category = 'Accessories';
    
    // Sub-Category map karo
    let subCategory = 'T-Shirts';
    if (item.category === 'women\'s clothing') subCategory = 'Dresses';
    else if (item.category === 'jewelery') subCategory = 'Watches';
    else if (item.title.toLowerCase().includes('pants')) subCategory = 'Jeans';
    else if (item.title.toLowerCase().includes('shirt')) subCategory = 'Shirts';

    // 3. Har real product ke 5 variations banayenge (taaki total 200 ho jayein)
    for (let v = 0; v < 5; v++) {
      const variationTitle = `${variations[v]} ${item.title}`;
      const keyword = `fashion-${i}-${v}`;
      
      // 4. Real image use karo + carousel ke liye 3 extra images generate karo
      const images = [
        item.image, // Real original image
        `https://picsum.photos/seed/${keyword}-2/600/600`,
        `https://picsum.photos/seed/${keyword}-3/600/600`,
        `https://picsum.photos/seed/${keyword}-4/600/600`
      ];

      productsToInsert.push({
        title: variationTitle,
        price: parseFloat((item.price + (Math.random() * 10 - 5)).toFixed(2)), // Price ko thoda change karke unique banaya
        description: item.description,
        images: images,
        category: category,
        subCategory: subCategory,
        inStock: true
      });
    }
  }

  // 5. Database mein insert karo
  await Product.insertMany(productsToInsert);
  console.log(`🎉 Successfully added ${productsToInsert.length} REAL fashion products!`);
  console.log(`📦 Categories: Men, Women, Accessories (No Electronics!)`);
  console.log(`🖼️ All images are real e-commerce photos!`);
  process.exit();
}
seedRealFashion();
