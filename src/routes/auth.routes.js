import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const authRoutes = express.Router();


// Initiate Google OAuth
authRoutes.get('/google', (req, res) => {
    return res.json({ message: "Done" })
});
passport.authenticate('google', { scope: ['profile', 'email'] })

// Handle OAuth callback
authRoutes.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        // Generate JWT token
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.redirect(`http://localhost:5173?token=${token}`); // Redirect to frontend with token
    }
);

export default authRoutes;
