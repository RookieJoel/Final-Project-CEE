import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.js'; // Adjust the path to your user model if needed

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    console.log('Request Body:', req.body); // Debugging log

    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error during signup:', error); // Log full error
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});



// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

export default router;
