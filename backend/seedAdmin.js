import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });

    console.log('MongoDB connected. Seeding/Updating Super Admin...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Aurum@2026', salt);

    const admin = await User.findOneAndUpdate(
      { email: 'admin@aurum.com' },
      {
        name: 'Aurum Super Admin',
        phone: '+44 20 7946 0000',
        password: hashedPassword,
        role: 'Super Admin',
        vipStatus: true,
      },
      { upsert: true, new: true }
    );

    console.log('Super Admin account created/updated successfully with requested credentials.');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
