import express from 'express';
import Gallery from '../models/Gallery.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET api/gallery
// @desc    Get all gallery images
// @access  Public
router.get('/', async (req, res) => {
  try {
    const gallery = await Gallery.find({});
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST api/gallery
// @desc    Create a gallery image
// @access  Private
router.post('/', protect, authorize('Super Admin', 'Manager'), async (req, res) => {
  try {
    const gallery = await Gallery.create(req.body);
    res.status(201).json(gallery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT api/gallery/:id
// @desc    Update a gallery image
// @access  Private
router.put('/:id', protect, authorize('Super Admin', 'Manager'), async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!gallery) return res.status(404).json({ message: 'Image not found' });
    res.json(gallery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE api/gallery/:id
// @desc    Delete a gallery image
// @access  Private
router.delete('/:id', protect, authorize('Super Admin', 'Manager'), async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: 'Image not found' });
    
    await gallery.deleteOne();
    res.json({ message: 'Image removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
