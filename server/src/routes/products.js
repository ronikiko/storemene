import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all products
router.get('/', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products').all();
    // Convert isNew from 0/1 to boolean
    const formattedProducts = products.map(p => ({
      ...p,
      isNew: Boolean(p.isNew)
    }));
    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product
router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    product.isNew = Boolean(product.isNew);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create product
router.post('/', (req, res) => {
  try {
    const { title, price, originalPrice, discount, imageUrl, rating, reviews, isNew, category } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO products (title, price, originalPrice, discount, imageUrl, rating, reviews, isNew, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      title,
      price,
      originalPrice || null,
      discount || null,
      imageUrl,
      rating || 0,
      reviews || 0,
      isNew ? 1 : 0,
      category
    );
    
    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    newProduct.isNew = Boolean(newProduct.isNew);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update product
router.put('/:id', (req, res) => {
  try {
    const { title, price, originalPrice, discount, imageUrl, rating, reviews, isNew, category } = req.body;
    
    const stmt = db.prepare(`
      UPDATE products 
      SET title = ?, price = ?, originalPrice = ?, discount = ?, imageUrl = ?, 
          rating = ?, reviews = ?, isNew = ?, category = ?
      WHERE id = ?
    `);
    
    const result = stmt.run(
      title,
      price,
      originalPrice || null,
      discount || null,
      imageUrl,
      rating || 0,
      reviews || 0,
      isNew ? 1 : 0,
      category,
      req.params.id
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    updatedProduct.isNew = Boolean(updatedProduct.isNew);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
