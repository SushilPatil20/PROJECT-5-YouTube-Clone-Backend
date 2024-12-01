import express from "express"
import { createChannel, getChannelById, updateChannel, getChannelByHandle } from "../controllers/channel.controller.js";
import validateImage from "../middlewares/validateImage.middleware.js";
import upload from "../middlewares/handleFile.middleware.js";
import uploadToCloudinary from "../middlewares/uploadImage.middleware.js";
import authToken from "../middlewares/auth.middleware.js"

const channelRoutes = express.Router();

const fields = [
    { name: "channelBanner", maxCount: 1 }
]

channelRoutes.post("/create", authToken, createChannel)
channelRoutes.put("/update/:channelId", authToken, upload(fields), validateImage, uploadToCloudinary('channelImages'), updateChannel)
channelRoutes.get("/getById/:channelId", getChannelById)
channelRoutes.get("/getByHandle/:handle", getChannelByHandle)



export default channelRoutes;
