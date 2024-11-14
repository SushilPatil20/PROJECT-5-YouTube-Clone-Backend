import videoValidationSchema from "../validations/video.validation.js"
import Video from "../models/video.model.js"
import mongoose from "mongoose";
import { deleteCloudinaryFile } from "../utils/helpers.js";


// export const createVideo = async (req, res) => {

/**
 *      [ 
 *          { 
 *            "title": "Learn React in 30 Minutes", 
 *            "thumbnailUrl": "https://example.com/thumbnails/react30min.png", 
 *            "description": "A quick tutorial to get started with React.", 
 *            "channelId": "channel01", 
 *            "uploader": "user01", 
 *            "views": 15200, 
 *            "likes": 1023,
 *            "dislikes": 45, 
 *            "uploadDate": "2024-09-20", 
 *            "comments": [ 
 *                           { 
 *                             "commentId": "comment01", 
 *                             "userId": "user02", 
 *                             "text":"Great video! Very helpful.", 
 *                             "timestamp": "2024-09-21T08:30:00Z" 
 *                            }
 *                        ]
 *          }
 *     ]
 */
// }


export const createVideo = async (req, res) => {
    const videoFiles = req.files || {}
    const videoData = req.body
    const videoUrl = videoFiles.videoUrl
    const thumbnailUrl = videoFiles.thumbnailUrl

    const combinedData = { videoUrl, thumbnailUrl, ...videoData }

    const { error } = videoValidationSchema.validate(combinedData, { abortEarly: false })

    if (error) {
        return res.status(400).json({ errors: error.details.map(detail => detail.message) });
    }

    try {
        const newVideo = await Video.create(combinedData);

        return res.json({ message: "Video created successfully.", video: newVideo });
    } catch (err) {
        console.error("Error creating video:", err);
        return res.status(500).json({ error: "Internal server error. Could not create video." });
    }
};



export const getAllVideos = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;    // Current page number (default: 1)
        const limit = parseInt(req.query.limit) || 12; // Number of videos per page (fixed at 12)
        const skip = (page - 1) * limit;               // Skip calculation for pagination

        const videos = await Video.find({})
            .skip(skip)
            .limit(limit)
            .sort({ uploadDate: -1 }) // Sort by upload date in descending order
            .select('-__v');          // Optional: Exclude fields like `__v`

        const totalVideos = await Video.countDocuments({});
        const hasMore = page * limit < totalVideos;     // Check if there are more videos

        res.json({ videos, hasMore });  // Send videos and `hasMore` flag
    } catch (err) {
        console.error("Error retrieving videos:", err);
        res.status(500).json({ error: "Internal server error. Could not retrieve videos." });
    }
};



// Define the getSingleVideo function to retrieve a specific video by its ID
export const getSingleVideo = async (req, res) => {
    // Extract videoId from the route parameters
    const { videoId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ error: "Invalid video ID format." });
        }

        const video = await Video.findById(videoId).select('-__v'); // Exclude __v for cleaner response

        // If the video doesn't exist, return a 404 response
        if (!video) {
            return res.status(404).json({ error: "Video not found." });
        }

        // If video found, send it in the response
        res.status(200).json({ video: video });

    } catch (error) {
        console.error("Error fetching video:", error);

        // Send a 500 status code for unexpected server errors
        res.status(500).json({ error: "Internal server error. Could not retrieve video." });
    }
};








export const deleteVideo = async (req, res) => {
    // Extract videoId from the route parameters
    const { videoId } = req.params;

    try {
        // Check if the videoId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ error: "Invalid video ID format." });
        }

        //  Find the video by its ID
        const video = await Video.findById(videoId);

        // Handle case where video is not found
        if (!video) {
            return res.status(404).json({ error: "Video not found." });
        }

        // delete video from Cloudinary 
        await deleteCloudinaryFile(video.videoUrl, "video")

        // delete image from Cloudinary 
        await deleteCloudinaryFile(video.thumbnailUrl, "image")

        //  Delete the video from database 
        await Video.findByIdAndDelete(videoId);

        // Respond with success message
        res.json({ message: "Video deleted successfully." });
    } catch (error) {
        // Step 6: Handle server errors
        console.error("Error deleting video:", error);
        res.status(500).json({ error: "Internal server error. Could not delete the video." });
    }
};



export const updateVideo = async (req, res) => {
    const { videoId } = req.params;
    const dataToUpdate = req.body || {};
    const { videoUrl, thumbnailUrl } = req.files

    try {
        // Validate videoId as a MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ error: "Invalid video ID format." });
        }

        // Fetch existing video data
        const existingVideo = await Video.findById(videoId);
        if (!existingVideo) {
            return res.status(404).json({ error: "Video not found." });
        }

        // delete video from cloud 
        if (videoUrl) {
            await deleteCloudinaryFile(existingVideo.videoUrl, "video")
            dataToUpdate.videoUrl = videoUrl
        }
        // delete image from cloud 
        if (thumbnailUrl) {
            await deleteCloudinaryFile(existingVideo.thumbnailUrl, "image")
            dataToUpdate.thumbnailUrl = thumbnailUrl
        }

        // Define default fields to consider for updates (fields expected from the user form)
        const formFields = ["title", "description", "videoUrl", "thumbnailUrl"];

        // Create an update object with fallback to existing data if field is missing or empty
        const updateData = {};
        formFields.forEach(field => {
            updateData[field] = dataToUpdate[field] || existingVideo[field];
        });

        // Allow other fields beyond the form fields to be updated directly
        Object.keys(dataToUpdate).forEach(field => {
            if (!formFields.includes(field)) {
                updateData[field] = dataToUpdate[field];
            }
        });

        // Perform the update with updated fields only
        const updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            { $set: updateData },
            { new: true, runValidators: true }  // Options: return updated doc and validate updates
        );

        // Respond with the updated video
        res.json({ message: "Video updated successfully.", video: updatedVideo });
    } catch (error) {
        console.error("Error updating video:", error);
        res.status(500).json({ error: "Internal server error. Could not update the video." });
    }
};































/**
  * --------------- Required fileds ---------------
  *
  * --------------- title
  * --------------- videoUrl -------------------- Files
  * --------------- thumbnailUrl ---------------- Files
  * --------------- channelId
  * --------------- uploader
  *
  * --------------- All fileds fileds ---------------
  *
  * --------------- Description  optional
  * --------------- views default 0
  * --------------- likes default 0
  * --------------- dislikes default 0
  * --------------- comments default []
  */






// Joi.object({
//     userId: Joi.string().required().messages({
//         "string.base": "User ID must be a string",
//         "string.empty": "User ID is required",
//     }),
//     content: Joi.string().max(500).required().messages({
//         "string.base": "Content must be a string",
//         "string.empty": "Content is required",
//         "string.max": "Content should have at most 500 characters",
//     }),
//     timestamp: Joi.date().default(() => new Date()).messages({
//         "date.base": "Timestamp must be a valid date",
//     }),
// })