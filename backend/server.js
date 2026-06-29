// nodemon trigger 3
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/auth.js';
import reservationRoutes from './routes/reservations.js';
import dashboardRoutes from './routes/dashboard.js';
import menuRoutes from './routes/menu.js';
import uploadRoutes from './routes/upload.js';
import chefRoutes from './routes/chefs.js';
import eventRoutes from './routes/events.js';
import testimonialRoutes from './routes/testimonials.js';
import contentRoutes from './routes/content.js';
import galleryRoutes from './routes/gallery.js';

// Load environmental variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Bindings
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chefs', chefRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/gallery', galleryRoutes);

// Root Healthcheck
app.get('/', (req, res) => {
  res.json({ status: 'active', message: 'Aurum Luxury Server Running.' });
});

// Error handling middleware fallback
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
