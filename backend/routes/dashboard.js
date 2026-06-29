import express from 'express';
import Reservation from '../models/Reservation.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET api/dashboard
// @desc    Get dashboard statistics and recent activity
// @access  Private (Super Admin, Manager, Staff)
router.get('/', protect, authorize('Super Admin', 'Manager', 'Staff'), async (req, res) => {
  try {
    const totalReservations = await Reservation.countDocuments({});
    
    // Get today's start and end date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayReservations = await Reservation.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const recentActivity = await Reservation.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    // Mock other stats until models are created
    const stats = {
      totalReservations,
      todayReservations,
      totalDishes: 24, // Mock
      totalChefs: 3,   // Mock
      totalEvents: 2,  // Mock
      totalRevenue: '$12,450', // Mock
    };

    res.json({ stats, recentActivity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
