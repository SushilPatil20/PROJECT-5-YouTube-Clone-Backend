import userValidationSchema from "../validations/user.validation.js"
import User from "../models/user.model.js"
import { hashPassword, comparePasswords } from "../utils/helpers.js";
import jwt from "jsonwebtoken"
import { JWT_SECRET_KEY } from "../config/dotenv.config.js"
import mongoose from "mongoose";


// -------------------------------- Register new user --------------------------------
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body
    // check if the file exist else set the avatar to null
    const { avatar } = req.files || null

    // Getting only name email and password 
    const userDataForValidation = { name, email, password }
    try {
        // pass the data for validation
        const { error } = userValidationSchema.validate(userDataForValidation, { abortEarly: false })
        if (error) {
            return res.status(400).json({ errors: error.details.map(detail => detail.message) });
        }

        // Check user with duplicate email 
        const existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) {
            return res.status(409).json({ error: "User with this email already exists" });
        }

        // hash the password before storing into DB
        const hashedPassword = await hashPassword(password);

        // // create the new user in the database 

        const newUser = await User.create({
            ...userDataForValidation,
            password: hashedPassword,
            avatar,
        });


        return res.status(201).json({ user: newUser, message: "User registered successfully" });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }
}


// -------------------------------- login user --------------------------------

export const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        // get the user with email
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        // if user ? compare db password with recent enterd password
        const isMatch = await comparePasswords(password, user.password)

        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // if password match ? create the JWT token and send it in response 
        const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '24h' })

        return res.status(200).json({ message: 'Login successful', token: token, userId: user._id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


export const getUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID format." });
        }

        // Validate the input
        if (!userId) {
            return res.status(400).json({
                status: 'error',
                message: 'User ID is required'
            });
        }

        // Find user by ID
        const user = await User.findById(userId).select('-password')
            .populate('channels')


        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }


        // Success response
        return res.status(200).json({ status: 'success', user });
    } catch (error) {
        console.error(`Error fetching user: ${error.message}`);

        // Server error response
        return res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching the user'
        });
    }
};