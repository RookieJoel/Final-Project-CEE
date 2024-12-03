import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import bodyParser from 'body-parser';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import threadRoutes from './src/routes/threadRoute.js';

dotenv.config();

const app = express();

// CORS options
const corsOptions = {
  origin: 'http://54.211.108.140:3221',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/threads', threadRoutes);

// Log Out Endpoint
app.post('/api/auth/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to log out' });
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  } else {
    res.status(200).json({ message: 'No active session' });
  }
});

// Include user information in session check
app.get('/api/auth/session', (req, res) => {
  if (req.session && req.session.userId) {
    res.status(200).json({
      loggedIn: true,
      username: req.session.username,
      userId: req.session.userId,
    });
  } else {
    res.status(200).json({ loggedIn: false });
  }
});

// Listen on port
app.listen(3222, () => {
  console.log('Server is running on port 3222');
});