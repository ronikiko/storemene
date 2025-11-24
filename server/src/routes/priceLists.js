import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all price lists with their items
router.get('/', (req, res) => {
  try {
    const priceLists = db.prepare('SELECT * FROM price_lists').all();
    
    // Get items for each price list
    const priceListsWithItems = priceLists.map(pl => {
      const items = db.prepare('SELECT productId, price FROM price_list_items WHERE priceListId = ?').all(pl.id);
      const prices = {};
      items.forEach(item => {
        prices[item.productId] = item.price;
      });
      return { ...pl, prices };
    });
    
    res.json(priceListsWithItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single price list
router.get('/:id', (req, res) => {
  try {
    const priceList = db.prepare('SELECT * FROM price_lists WHERE id = ?').get(req.params.id);
    if (!priceList) {
      return res.status(404).json({ error: 'Price list not found' });
    }
    
    const items = db.prepare('SELECT productId, price FROM price_list_items WHERE priceListId = ?').all(req.params.id);
    const prices = {};
    items.forEach(item => {
      prices[item.productId] = item.price;
    });
    
    res.json({ ...priceList, prices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create price list
router.post('/', (req, res) => {
  try {
    const { id, name, prices } = req.body;
    
    // Insert price list
    const stmt = db.prepare('INSERT INTO price_lists (id, name) VALUES (?, ?)');
    stmt.run(id, name);
    
    // Insert price list items
    if (prices && typeof prices === 'object') {
      const itemStmt = db.prepare('INSERT INTO price_list_items (priceListId, productId, price) VALUES (?, ?, ?)');
      for (const [productId, price] of Object.entries(prices)) {
        itemStmt.run(id, parseInt(productId), price);
      }
    }
    
    const newPriceList = db.prepare('SELECT * FROM price_lists WHERE id = ?').get(id);
    const items = db.prepare('SELECT productId, price FROM price_list_items WHERE priceListId = ?').all(id);
    const pricesObj = {};
    items.forEach(item => {
      pricesObj[item.productId] = item.price;
    });
    
    res.status(201).json({ ...newPriceList, prices: pricesObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update price list
router.put('/:id', (req, res) => {
  try {
    const { name, prices } = req.body;
    
    // Update price list name
    const stmt = db.prepare('UPDATE price_lists SET name = ? WHERE id = ?');
    const result = stmt.run(name, req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Price list not found' });
    }
    
    // Delete existing items and insert new ones
    if (prices && typeof prices === 'object') {
      db.prepare('DELETE FROM price_list_items WHERE priceListId = ?').run(req.params.id);
      const itemStmt = db.prepare('INSERT INTO price_list_items (priceListId, productId, price) VALUES (?, ?, ?)');
      for (const [productId, price] of Object.entries(prices)) {
        itemStmt.run(req.params.id, parseInt(productId), price);
      }
    }
    
    const updatedPriceList = db.prepare('SELECT * FROM price_lists WHERE id = ?').get(req.params.id);
    const items = db.prepare('SELECT productId, price FROM price_list_items WHERE priceListId = ?').all(req.params.id);
    const pricesObj = {};
    items.forEach(item => {
      pricesObj[item.productId] = item.price;
    });
    
    res.json({ ...updatedPriceList, prices: pricesObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE price list
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM price_lists WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Price list not found' });
    }
    
    res.json({ message: 'Price list deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
