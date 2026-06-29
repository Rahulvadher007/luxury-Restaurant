import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide the event title'],
    trim: true,
  },
  date: {
    type: String,
    required: [true, 'Please provide the event date'],
  },
  time: {
    type: String,
    required: [true, 'Please provide the event time'],
  },
  description: {
    type: String,
    required: [true, 'Please provide the event description'],
  },
  price: {
    type: String,
    required: [true, 'Please provide the event price or entry fee'],
  },
  image: {
    type: String,
    default: '',
  },
  isUpcoming: {
    type: Boolean,
    default: true,
  }
});

export default mongoose.model('Event', EventSchema);
