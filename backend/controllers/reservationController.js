import Reservation from '../models/Reservation.js';
import { sendReservationEmail, sendTestEmail } from '../utils/mailService.js';

export const checkAvailability = async (req, res) => {
  const { date, time } = req.query;

  if (!date || !time) {
    return res.status(400).json({ message: 'Please provide both date and time parameters.' });
  }

  try {
    const reservationCount = await Reservation.countDocuments({ date, time, status: 'Confirmed' });
    const available = reservationCount < 5;
    res.json({ available, currentReservations: reservationCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReservation = async (req, res) => {
  const { name, email, phone, date, time, guests, occasion, assignedTable, specialRequests } = req.body;

  try {
    const reservationCount = await Reservation.countDocuments({ date, time, status: 'Confirmed' });
    if (reservationCount >= 5) {
      return res.status(400).json({ message: 'Selected time slot is fully booked.' });
    }

    const reservation = await Reservation.create({
      name,
      email,
      phone,
      date,
      time,
      guests,
      occasion,
      assignedTable,
      specialRequests,
      status: 'Pending',
      emailLogs: [{ action: 'Reservation Submitted (Pending)', timestamp: new Date() }]
    });

    res.status(201).json({ success: true, reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({}).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReservationStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    
    reservation.status = status;
    reservation.emailLogs.push({ action: `Status updated to ${status}`, timestamp: new Date() });
    
    await reservation.save();

    // Trigger email if Confirmed or Rejected
    if (status === 'Confirmed' || status === 'Rejected') {
      // Async trigger, don't wait to return response
      sendReservationEmail(reservation, status);
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendReservationEmail = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    
    if (reservation.status !== 'Confirmed' && reservation.status !== 'Rejected') {
      return res.status(400).json({ message: 'Can only send emails for Confirmed or Rejected reservations.' });
    }

    // Call service to resend email and await result
    const result = await sendReservationEmail(reservation, reservation.status);
    
    if (result.success) {
      res.json({ message: 'Email resent successfully.' });
    } else {
      res.status(500).json({ message: 'Failed to send email', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    
    await reservation.deleteOne();
    res.json({ message: 'Reservation removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const testEmailEndpoint = async (req, res) => {
  try {
    const result = await sendTestEmail();
    res.json({ message: 'Test email sent successfully!', messageId: result.messageId });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send test email', error: error.message });
  }
};
