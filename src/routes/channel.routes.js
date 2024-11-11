import express from "express"
import { createChannel, getChannel } from "../controllers/channel.controller.js";
import validateImage from "../middlewares/validateImage.middleware.js";
import upload from "../middlewares/handleFile.middleware.js";
import uploadToCloudinary from "../middlewares/uploadImage.middleware.js";

const channelRoutes = express.Router();

channelRoutes.post("/create", upload('channelBanner'), validateImage, uploadToCloudinary('channel-image', 'channelBanner'), createChannel)
channelRoutes.get("/get/:channelId", getChannel)


export default channelRoutes;
