import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/dotenv.config.js';

// ----------- Middleware to protect routes
export const authToken = (req, res, next) => {
    // ----------- Get the token from the Authorization header -----------
    const token = req.header('Authorization')?.split(' ')[1]; // ------------ Bearer token
    if (!token) {
        return res.status(401).json({ message: 'Access denied: No authentication token provided. Please log in to access this resource.' });
    }

    // ----------- Verifing the token -----------
    try {
        jwt.verify(token, JWT_SECRET_KEY, (error, decoded) => {
            if (error) {
                if (error.name === 'TokenExpiredError') {
                    return res.status(403).json({ message: 'Token has expired, please login again' });
                } else {
                    return res.status(403).json({ message: 'Invalid token, please login again' })
                }
            }
            // ----------- Adding decoded token data (e.g., userId) to the request object -----------
            req.user = decoded.userId;
            next();
        });

    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token', message: 'Please login' });
    }
};

export default authToken;