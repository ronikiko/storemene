import express from 'express';
import { db } from '../db/index.js';
import { categories } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = express.Router();

// GET all categories
router.get('/', async (req, res) => {
  try {
    const allCategories = await db.select().from(categories);
    res.json(allCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single category
router.get('/:id', async (req, res) => {
  try {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, req.params.id));
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create category
router.post('/', async (req, res) => {
  try {
    const { id, name, icon } = req.body;
    
    const [newCategory] = await db
      .insert(categories)
      .values({ id, name, icon })
      .returning();
    
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update category
router.put('/:id', async (req, res) => {
  try {
    const { name, icon } = req.body;
    
    const [updatedCategory] = await db
      .update(categories)
      .set({ name, icon })
      .where(eq(categories.id, req.params.id))
      .returning();
    
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE category
router.delete('/:id', async (req, res) => {
  try {
    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, req.params.id))
      .returning();
    
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
