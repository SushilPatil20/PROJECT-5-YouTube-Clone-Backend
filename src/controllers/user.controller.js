import userValidationSchema from "../validations/user.validation.js"
import User from "../models/user.model.js"
import { hashPassword } from "../utils/helpers.js";

export const registerUser = async (req, res) => {
    try {
        const { error } = userValidationSchema.validate(req.body, { abortEarly: false })
        if (error) {
            return res.status(400).json({ errors: error.details.map(detail => detail.message) });
        }
        const existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) {
            return res.status(409).json({ error: "User with this email already exists" });
        }
        const hashedPassword = await hashPassword(req.body.password);

        // Add remaning feild as well 
        // Create the new user Object with all fields.



        res.status(201).json({ password: hashedPassword, message: "User registered successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}