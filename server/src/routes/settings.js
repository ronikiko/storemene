import express from 'express';
import { db } from '../db/index.js';
import { settings } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = express.Router();

// GET all settings
router.get('/', async (req, res) => {
  try {
    const allSettings = await db.select().from(settings);
    res.json(allSettings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single setting
router.get('/:id', async (req, res) => {
  try {
    const [setting] = await db
      .select()
      .from(settings)
      .where(eq(settings.id, req.params.id));
    
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update setting (with upsert)
router.put('/:id', async (req, res) => {
  try {
    const { value } = req.body;
    
    // Try to update first
    const [updatedSetting] = await db
      .update(settings)
      .set({ value })
      .where(eq(settings.id, req.params.id))
      .returning();
    
    // If setting doesn't exist, create it
    if (!updatedSetting) {
      const [newSetting] = await db
        .insert(settings)
        .values({ id: req.params.id, value })
        .returning();
      return res.json(newSetting);
    }
    
    res.json(updatedSetting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
