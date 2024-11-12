import express from "express"
import validateVideo from "../middlewares/validateVideo.middlewares.js"
import validateImage from "../middlewares/validateImage.middleware.js";
import upload from "../middlewares/handleFile.middleware.js"
import uploadToCloudinary from "../middlewares/uploadImage.middleware.js"
import { createVideo } from "../controllers/video.controller.js";
const videoRoutes = express.Router();

const fields = [
    { name: 'videoUrl', maxCount: 1 },
    { name: 'thumbnailUrl', maxCount: 1 },
];

videoRoutes.post('/create', upload(fields), validateImage, validateVideo, uploadToCloudinary('videoFiles'), createVideo)

export default videoRoutes 