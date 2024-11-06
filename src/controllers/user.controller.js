import userValidationSchema from "../validations/user.validation.js"
import User from "../models/user.model.js"
import { hashPassword } from "../utils/helpers.js";

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body
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

        // check if the file exist else set the avatar to null
        const avatar = req.file ? req.file.avatarURL : null

        // create the new user in the database 
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            avatar,
        })

        return res.status(201).json({ user: newUser, message: "User registered successfully" });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }
}