import express from "express"
import { registerUser } from "../controllers/user.controller.js"
import validateImage from "../middlewares/validateImage.middleware.js"
import uploadToCloudinary from "../middlewares/uploadImage.middleware.js"
import upload from "../middlewares/handleFile.middleware.js"
const userRoutes = express.Router()

userRoutes.post('/', upload('avatar'), validateImage, uploadToCloudinary, registerUser)


export default userRoutes