import express from 'express';
import Testimonial from '../models/Testimonial.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Basic Profanity Filter
const PROFANITY_LIST = ['spam', 'scam', 'fake', 'bullshit', 'fuck', 'shit', 'bitch'];
const containsProfanity = (text) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return PROFANITY_LIST.some(word => lowerText.includes(word));
};

// @route   POST api/testimonials
// @desc    Submit a customer review
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, rating, review, image } = req.body;

    // 1. Duplicate Review Check (Same email within 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentReview = await Testimonial.findOne({ 
      email, 
      createdAt: { $gte: oneDayAgo } 
    });

    if (recentReview) {
      return res.status(429).json({ message: 'You have already submitted a review recently. Please wait 24 hours.' });
    }

    // 2. Profanity Filter Check
    let status = 'pending';
    if (containsProfanity(review) || containsProfanity(name)) {
      status = 'rejected'; // Auto-reject if profanity is found
    }

    const testimonial = await Testimonial.create({
      name,
      email,
      rating,
      review,
      image,
      status
    });

    // If auto-rejected, still send success to user to prevent them from trying to bypass
    res.status(201).json({ message: 'Review submitted successfully.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET api/testimonials
// @desc    Get all APPROVED testimonials (For Public Website)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET api/testimonials/admin
// @desc    Get ALL testimonials (For Admin Moderation)
// @access  Private
router.get('/admin', protect, authorize('Super Admin', 'Manager'), async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT api/testimonials/:id/status
// @desc    Update a testimonial status / featured
// @access  Private
router.put('/:id/status', protect, authorize('Super Admin', 'Manager'), async (req, res) => {
  try {
    const { status, featured } = req.body;
    
    // Build update object dynamically
    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (featured !== undefined) updateFields.featured = featured;

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id, 
      updateFields, 
      { new: true, runValidators: true }
    );

    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE api/testimonials/:id
// @desc    Delete a testimonial permanently
// @access  Private
router.delete('/:id', protect, authorize('Super Admin', 'Manager'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    
    await testimonial.deleteOne();
    res.json({ message: 'Testimonial permanently removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
