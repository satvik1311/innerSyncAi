// const Author = require('../Models/userModel');
import Author from '../Models/userModel.js';

const signUp =async(req, res)=>{
    try {
        const { name, username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await Author.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }else{
            const newUser = new Author({ name, username, email, password });
            await newUser.save();
            res.status(201).json({ message: 'User registered successfully' });
        }
    }catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.error('Signup controller error:', error);
    }
}

const Login = async(req, res)=>{
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await Author.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }else{
            // Check password
            if (user.password !== password) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }else{
                res.status(200).json({ message: 'Login successful' });
            }
        }
    }catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.error('Login controller error:', error);
    }
}

// module.exports = { signUp , Login };
export { signUp , Login };