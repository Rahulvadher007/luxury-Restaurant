import express from 'express';
import Event from '../models/Event.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST api/events
// @desc    Create an event
// @access  Private
router.post('/', protect, authorize('Super Admin', 'Manager'), async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private
router.put('/:id', protect, authorize('Super Admin', 'Manager'), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private
router.delete('/:id', protect, authorize('Super Admin', 'Manager'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
