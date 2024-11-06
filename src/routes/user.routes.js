import express from "express"
import { registerUser, loginUser } from "../controllers/user.controller.js"
import validateImage from "../middlewares/validateImage.middleware.js"
import uploadToCloudinary from "../middlewares/uploadImage.middleware.js"
import upload from "../middlewares/handleFile.middleware.js"
const userRoutes = express.Router()

userRoutes.post('/singup', upload('avatar'), validateImage, uploadToCloudinary, registerUser)
userRoutes.post('/singin', loginUser)



export default userRoutes