import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the customer name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide the customer email'],
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5,
  },
  review: {
    type: String,
    required: [true, 'Please provide the review message'],
  },
  image: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  featured: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export default mongoose.model('Testimonial', TestimonialSchema);
