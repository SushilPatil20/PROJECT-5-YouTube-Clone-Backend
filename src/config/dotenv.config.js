import dotenv from 'dotenv';

// ---------------- Load environment variables from a .env file into process.env ----------------
dotenv.config();

// ---------------- The port for the application to run on (defaults to 5000 if not set) ----------------
export const PORT = process.env.PORT || 5000;

// ---------------- MongoDB connection URI (from environment variables) ----------------
export const MONGO_URI = process.env.MONGO_URI;

// ---------------- Cloudinary configuration for file uploads ----------------
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;  // Cloud name for Cloudinary
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;        // API key for Cloudinary
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;  // API secret for Cloudinary

// ---------------- JWT secret key for signing and verifying JWT tokens ----------------
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
