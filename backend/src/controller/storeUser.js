import User from '../models/user.js';

import bcrypt from 'bcrypt';


// Sign Up
export const signUp = async (req, res) => {
  const { username, email, password } = req.body; // Include username
  try {
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'Email already exists' });
      }

      // Check if username already exists
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
          return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10); // Hash password
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
      res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// Log In
// Log In
export const logIn = async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    try {
      const user = await User.findOne({
        $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Store user info in session
      req.session.userId = user._id;
      req.session.username = user.username;
  
      res.status(200).json({
        message: 'Login successful',
        username: user.username,
        userId: user._id,
      });
    } catch (err) {
      res.status(500).json({ message: 'Error logging in', error: err.message });
    }
  };
  
  



