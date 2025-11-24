import express from 'express';
import db from '../db.js';

const router = express.Router();

// POST authenticate customer by token
router.post('/customer', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    const customer = db.prepare('SELECT * FROM customers WHERE token = ?').get(token);
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST admin login (simple hardcoded check)
router.post('/admin', (req, res) => {
  try {
    const { password } = req.body;
    
    // Simple hardcoded admin password
    if (password === 'admin123') {
      res.json({ success: true, message: 'Admin authenticated' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
