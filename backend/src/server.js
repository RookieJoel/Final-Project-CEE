import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import cors from 'cors';

dotenv.config(); // Load environment variables from .env

const app = express(); // Initialize the app object

app.use(cors()); // Use CORS middleware

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

connectDB(); // Connect to MongoDB

// Serve static files for frontend
app.use(express.static('frontend/public'));

// Mount API routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000; // Use a default value if PORT is not defined
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
