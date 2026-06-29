import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true, // e.g., 'hero', 'contact', 'about'
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  }
});

export default mongoose.model('Content', ContentSchema);
