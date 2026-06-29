import mongoose from 'mongoose';

const ChefSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the chef name'],
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide the chef title (e.g. Executive Chef)'],
  },
  bio: {
    type: String,
    required: [true, 'Please provide a bio for the chef'],
  },
  image: {
    type: String,
    default: '',
  },
  signatureDish: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  }
});

export default mongoose.model('Chef', ChefSchema);
