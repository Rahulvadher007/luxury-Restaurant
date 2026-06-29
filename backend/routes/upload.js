import express from 'express';
import { upload } from '../config/cloudinary.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST api/upload
// @desc    Upload an image to Cloudinary and return the URL
// @access  Private (Super Admin, Manager)
router.post('/', protect, authorize('Super Admin', 'Manager'), upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    // Return the Cloudinary URL
    res.status(201).json({ 
      success: true, 
      imageUrl: req.file.path,
      publicId: req.file.filename 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during upload' });
  }
});

export default router;
