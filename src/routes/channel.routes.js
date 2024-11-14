import express from "express"
import { createChannel, getChannel, updateChannel } from "../controllers/channel.controller.js";
import validateImage from "../middlewares/validateImage.middleware.js";
import upload from "../middlewares/handleFile.middleware.js";
import uploadToCloudinary from "../middlewares/uploadImage.middleware.js";

const channelRoutes = express.Router();

const fields = [
    { name: "channelBanner", maxCount: 1 }
]

channelRoutes.post("/create", createChannel)
channelRoutes.put("/update/:channelId", upload(fields), validateImage, uploadToCloudinary('channelImages'), updateChannel)
channelRoutes.get("/get/:channelId", getChannel)



export default channelRoutes;
