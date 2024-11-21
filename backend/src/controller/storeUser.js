import bcrypt from 'bcryptjs';
import User from '../models/user.js';

// Signup Logic
export const signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User Registered Successfully!');
    } catch (error) {
        res.status(400).send('Error Registering User: ' + error.message);
    }
};

// Login Logic
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid Credentials');
        }

        // Set authentication logic here (e.g., cookies)
        res.status(200).send('Login Successful');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};
