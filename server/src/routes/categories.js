import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all categories
router.get('/', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single category
router.get('/:id', (req, res) => {
  try {
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create category
router.post('/', (req, res) => {
  try {
    const { id, name, icon } = req.body;
    
    const stmt = db.prepare('INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)');
    stmt.run(id, name, icon);
    
    const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update category
router.put('/:id', (req, res) => {
  try {
    const { name, icon } = req.body;
    
    const stmt = db.prepare('UPDATE categories SET name = ?, icon = ? WHERE id = ?');
    const result = stmt.run(name, icon, req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const updatedCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE category
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
