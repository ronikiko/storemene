import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all customers
router.get('/', (req, res) => {
  try {
    const customers = db.prepare('SELECT * FROM customers').all();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single customer
router.get('/:id', (req, res) => {
  try {
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create customer
router.post('/', (req, res) => {
  try {
    const { id, name, email, phone, priceListId, token } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO customers (id, name, email, phone, priceListId, token)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, name, email, phone, priceListId || null, token);
    
    const newCustomer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update customer
router.put('/:id', (req, res) => {
  try {
    const { name, email, phone, priceListId } = req.body;
    
    const stmt = db.prepare(`
      UPDATE customers 
      SET name = ?, email = ?, phone = ?, priceListId = ?
      WHERE id = ?
    `);
    
    const result = stmt.run(name, email, phone, priceListId || null, req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    const updatedCustomer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE customer
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM customers WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
