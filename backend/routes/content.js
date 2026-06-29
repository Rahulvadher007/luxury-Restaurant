import express from 'express';
import Content from '../models/Content.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET api/content/:key
// @desc    Get website content by key
// @access  Public
router.get('/:key', async (req, res) => {
  try {
    const content = await Content.findOne({ key: req.params.key });
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT api/content/:key
// @desc    Update or create website content by key
// @access  Private
router.put('/:key', protect, authorize('Super Admin', 'Manager'), async (req, res) => {
  try {
    const content = await Content.findOneAndUpdate(
      { key: req.params.key },
      { key: req.params.key, data: req.body.data },
      { new: true, upsert: true, runValidators: true } // Upsert creates if it doesn't exist
    );
    res.json(content);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
