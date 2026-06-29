import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const uri = process.env.MONGO_URI;
console.log('Testing connection to:', uri);

mongoose.connect(uri, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
  serverSelectionTimeoutMS: 5000 // fail fast
}).then(() => {
  console.log('Successfully connected to MongoDB!');
  process.exit(0);
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
  process.exit(1);
});
