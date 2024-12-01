import express from "express"
import { registerUser, loginUser, getUser } from "../controllers/user.controller.js"
import validateImage from "../middlewares/validateImage.middleware.js"
import uploadToCloudinary from "../middlewares/uploadImage.middleware.js"
import upload from "../middlewares/handleFile.middleware.js"
import authToken from "../middlewares/auth.middleware.js"
const userRoutes = express.Router()

const fields = [
    { name: 'avatar', maxCount: 1 },
];

userRoutes.get('/get/:userId', authToken, getUser)
userRoutes.post('/register', upload(fields), validateImage, uploadToCloudinary('userProfiles'), registerUser)
userRoutes.post('/login', loginUser)

export default userRoutes