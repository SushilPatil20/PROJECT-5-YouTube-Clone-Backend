import express from "express"
import validateVideo from "../middlewares/validateVideo.middlewares.js"
import validateImage from "../middlewares/validateImage.middleware.js";
import upload from "../middlewares/handleFile.middleware.js"
import uploadToCloudinary from "../middlewares/uploadImage.middleware.js"
import { createVideo, deleteVideo, getAuthUserVideos, getAllVideos, getSingleVideo, updateVideo, searchVideos, getRecommendedVideos, getFilteredVideos } from "../controllers/video.controller.js";
import authToken from "../middlewares/auth.middleware.js"

const videoRoutes = express.Router();

const fields = [
    { name: 'videoUrl', maxCount: 1 },
    { name: 'thumbnailUrl', maxCount: 1 },
];

videoRoutes.post('/create', authToken, upload(fields), validateImage, validateVideo, uploadToCloudinary('videoFiles'), createVideo)
videoRoutes.get('/get', getAllVideos)
videoRoutes.get('/get/:videoId', getSingleVideo)
videoRoutes.get('/getAuthUserVideos/:userId', getAuthUserVideos)
videoRoutes.put('/update/:videoId', authToken, upload(fields), validateImage, validateVideo, uploadToCloudinary('videoFiles'), updateVideo)
videoRoutes.delete('/delete/:videoId', authToken, deleteVideo)
videoRoutes.get('/search', searchVideos)
videoRoutes.get('/recommended/:videoId', getRecommendedVideos);
videoRoutes.get('/filtered/:category', getFilteredVideos);

export default videoRoutes 