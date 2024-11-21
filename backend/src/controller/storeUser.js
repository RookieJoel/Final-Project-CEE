import User from '../models/user.js';

// Sign Up
export const signUp = async (req, res) => {
  const { username } = req.body;

  try {
    // ตรวจสอบว่ามี username ซ้ำหรือไม่
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // สร้างผู้ใช้ใหม่
    const newUser = new User({ username });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// Log In
export const logIn = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // บันทึก ID ผู้ใช้ใน session
    req.session.userId = user._id;

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

