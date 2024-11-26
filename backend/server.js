import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js'; // Use this for auth routes

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:3221', credentials: true }));
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

// Connect to MongoDB
connectDB();

// Use Auth Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3222;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
