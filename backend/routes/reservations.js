import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { 
  checkAvailability, 
  createReservation, 
  getReservations, 
  updateReservationStatus, 
  deleteReservation,
  resendReservationEmail,
  testEmailEndpoint
} from '../controllers/reservationController.js';

const router = express.Router();

// Public Routes
router.get('/check-availability', checkAvailability);
router.post('/create', createReservation);
router.get('/test-email', testEmailEndpoint); // Protected in production, open for testing

// Protected Routes (Admin/Staff)
router.get('/', protect, authorize('Super Admin', 'Manager', 'Staff'), getReservations);
router.put('/:id/status', protect, authorize('Super Admin', 'Manager'), updateReservationStatus);
router.post('/:id/resend-email', protect, authorize('Super Admin', 'Manager'), resendReservationEmail);
router.delete('/:id', protect, authorize('Super Admin', 'Manager'), deleteReservation);

export default router;
