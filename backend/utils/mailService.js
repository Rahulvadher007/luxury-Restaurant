import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { confirmationTemplate, rejectionTemplate } from './emailTemplates.js';
import Reservation from '../models/Reservation.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendReservationEmail = async (reservation, type) => {
  try {
    let htmlContent = '';
    let subject = '';

    if (type === 'Confirmed') {
      htmlContent = confirmationTemplate(reservation);
      subject = 'Your Dining Residency Confirmation - AURUM';
    } else if (type === 'Rejected') {
      htmlContent = rejectionTemplate(reservation);
      subject = 'Update regarding your reservation request - AURUM';
    } else {
      throw new Error('Invalid email type');
    }

    const mailOptions = {
      from: `"Aurum Concierge" <${process.env.EMAIL_USER}>`,
      to: reservation.email,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Update reservation with success status
    await Reservation.findByIdAndUpdate(reservation._id, {
      emailStatus: 'Sent',
      emailSentAt: new Date(),
      emailMessageId: info.messageId,
      $push: { emailLogs: { action: `${type} Email Sent`, timestamp: new Date() } }
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email Delivery Error:', error);
    
    // Update reservation with failure status
    await Reservation.findByIdAndUpdate(reservation._id, {
      emailStatus: 'Failed',
      $push: { emailLogs: { action: `Failed to send ${type} email`, timestamp: new Date() } }
    });

    return { success: false, error: error.message };
  }
};

export const sendTestEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: `"Aurum Concierge" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Test Email - Aurum Email System',
      html: '<h1>SMTP Configuration is Working!</h1><p>The Aurum reservation automated email system is online.</p>',
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Test Email Failed:', error);
    throw error;
  }
};
