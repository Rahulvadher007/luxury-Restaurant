import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address',
    ],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
  },
  date: {
    type: String,
    required: [true, 'Please provide a date'],
  },
  time: {
    type: String,
    required: [true, 'Please provide a preferred timing slot'],
  },
  guests: {
    type: Number,
    required: [true, 'Please specify the guest count'],
  },
  occasion: {
    type: String,
    enum: ['Couple', 'Business', 'Family', 'Birthday'],
    required: [true, 'Please select the dining occasion'],
  },
  assignedTable: {
    type: String,
    required: [true, 'Please specify the assigned dining table'],
  },
  specialRequests: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Rejected', 'Cancelled'],
    default: 'Pending',
  },
  emailStatus: {
    type: String,
    enum: ['Pending', 'Sent', 'Failed'],
    default: 'Pending',
  },
  emailSentAt: {
    type: Date,
  },
  emailMessageId: {
    type: String,
  },
  emailLogs: [
    {
      action: String,
      timestamp: {
        type: Date,
        default: Date.now,
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Reservation', ReservationSchema);
