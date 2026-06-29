import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an image title'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['Interior', 'Dishes', 'Events', 'Behind the Scenes'],
    default: 'Interior',
  },
  image: {
    type: String,
    required: [true, 'Please provide the image URL'],
  },
  featured: {
    type: Boolean,
    default: false,
  }
});

export default mongoose.model('Gallery', GallerySchema);
