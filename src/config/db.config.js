import mongoose from 'mongoose';
import { MONGO_URI } from './dotenv.config.js';

// ---------------- Function to connect to MongoDB ----------------
export const connectToDB = async () => {
    try {
        //---------------- Attempt to connect to the MongoDB database using the URI from the environment config ----------------
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB'); // ---------------- Success message if the connection is successful ----------------
    } catch (error) {
        //  ---------------- If there's an error during the connection process, log it ----------------
        console.error('MongoDB connection error:', error);
        // ---------------- Exit the process with an error code if the connection fails ----------------
        process.exit(1);
    }
};
