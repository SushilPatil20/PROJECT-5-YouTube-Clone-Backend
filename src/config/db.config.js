// Import the mongoose library to interact with MongoDB
import mongoose from 'mongoose';

// Import the MongoDB connection string (MONGO_URI) from the environment configuration file
import { MONGO_URI } from './dotenv.config.js';

// ---------------- Function to connect to MongoDB ----------------
export const connectToDB = async () => {

    try {
        // ---------------- Attempt to connect to MongoDB using the connection URI (MONGO_URI) ----------------
        await mongoose.connect(MONGO_URI);

        // ---------------- Success message if the connection is successful ----------------
        console.log('Connected to MongoDB');

    } catch (error) {
        // ---------------- If there is any error during the connection attempt, catch it and log the error ----------------
        console.error('MongoDB connection error:', error);

        // ---------------- Exit the process with a failure code (1) if the connection fails ----------------
        process.exit(1);
    }
};
