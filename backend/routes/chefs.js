import express from 'express';
import Chef from '../models/Chef.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET api/chefs
// @desc    Get all chefs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const chefs = await Chef.find({}).sort({ order: 1 });
    res.json(chefs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST api/chefs
// @desc    Create a chef
// @access  Private
router.post('/', protect, authorize('Super Admin', 'Manager'), async (req, res) => {
  try {
    const chef = await Chef.create(req.body);
    res.status(201).json(chef);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT api/chefs/:id
// @desc    Update a chef
// @access  Private
router.put('/:id', protect, authorize('Super Admin', 'Manager'), async (req, res) => {
  try {
    const chef = await Chef.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!chef) return res.status(404).json({ message: 'Chef not found' });
    res.json(chef);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE api/chefs/:id
// @desc    Delete a chef
// @access  Private
router.delete('/:id', protect, authorize('Super Admin', 'Manager'), async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id);
    if (!chef) return res.status(404).json({ message: 'Chef not found' });
    
    await chef.deleteOne();
    res.json({ message: 'Chef removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
