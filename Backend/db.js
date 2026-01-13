// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://jainbhavya0527_db_user:IixqWBiROV78vbnb@cluster0.c5luhhx.mongodb.net/auth');
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

// module.exports = connectDB;
export default connectDB;