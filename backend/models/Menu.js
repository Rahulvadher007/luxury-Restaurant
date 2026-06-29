import mongoose from 'mongoose';

const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the item name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide the item description'],
  },
  price: {
    type: String,
    required: [true, 'Please provide the item price'],
  },
  category: {
    type: String,
    required: [true, 'Please provide the category (e.g. food, dessert, beverage)'],
    lowercase: true,
  },
  chefRecommendation: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: '',
  },
});

export default mongoose.model('Menu', MenuSchema);
