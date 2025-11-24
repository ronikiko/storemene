import express from 'express';
import { db } from '../db/index.js';
import { products } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const allProducts = await db.select().from(products);
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(req.params.id)));
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create product
router.post('/', async (req, res) => {
  try {
    const { title, price, originalPrice, discount, imageUrl, rating, reviews, isNew, category } = req.body;
    
    const [newProduct] = await db
      .insert(products)
      .values({
        title,
        price,
        originalPrice: originalPrice || null,
        discount: discount || null,
        imageUrl,
        rating: rating || 0,
        reviews: reviews || 0,
        isNew: isNew || false,
        category,
      })
      .returning();
    
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const { title, price, originalPrice, discount, imageUrl, rating, reviews, isNew, category } = req.body;
    
    const [updatedProduct] = await db
      .update(products)
      .set({
        title,
        price,
        originalPrice: originalPrice || null,
        discount: discount || null,
        imageUrl,
        rating: rating || 0,
        reviews: reviews || 0,
        isNew: isNew || false,
        category,
      })
      .where(eq(products.id, parseInt(req.params.id)))
      .returning();
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const [deletedProduct] = await db
      .delete(products)
      .where(eq(products.id, parseInt(req.params.id)))
      .returning();
    
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
