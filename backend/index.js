// index.js or app.js

// Import necessary modules
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

console.log("MongoDB URI:", process.env.MONGO_URI); // Check if MONGO_URI is loaded correctly
// Initialize express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

// Middleware (e.g., for parsing JSON)
app.use(express.json());

// Define routes
import authRoutes from './src/routes/auth.js';
app.use('/auth', authRoutes);

// Set up server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
