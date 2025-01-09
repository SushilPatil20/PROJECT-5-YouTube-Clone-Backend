import videoValidationSchema from "../validations/video.validation.js"
import Video from "../models/video.model.js"
import mongoose from "mongoose";
import { deleteCloudinaryFile, generateTags } from "../utils/helpers.js";
import Channel from "../models/channel.model.js";
import searchSchema from "../validations/searchQuerySchema.js";

export const createVideo = async (req, res) => {
    const videoFiles = req.files || {}
    const { channelId, title, description } = req.body
    const videoData = { title, description }
    const videoUrl = videoFiles.videoUrl
    const thumbnailUrl = videoFiles.thumbnailUrl
    const userId = req.user
    const combinedData = { videoUrl, thumbnailUrl, ...videoData, uploader: userId, channelId }

    const { error } = videoValidationSchema.validate(combinedData, { abortEarly: false })

    if (error) {
        return res.status(400).json({ errors: error.details.map(detail => detail.message) });
    }

    try {

        // Automatically generate tags
        const tags = generateTags(combinedData.title, combinedData.description);

        const newVideo = await Video.create({ ...combinedData, tags });
        await Channel.findByIdAndUpdate(
            channelId,
            { $push: { videos: newVideo._id } },
        )

        return res.json({ message: "Video created successfully.", video: newVideo });
    } catch (err) {
        console.error("Error creating video:", err);
        return res.status(500).json({ error: "Internal server error. Could not create video." });
    }
};



export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find({})
            .populate('channelId')
            .sort({ createdAt: -1 });
        res.json({ videos });

    } catch (err) {
        console.error("Error retrieving videos:", err);
        res.status(500).json({ error: "Internal server error. Could not retrieve videos." });
    }
};

export const getAuthUserVideos = async (req, res) => {
    const { userId } = req.params

    if (!userId) {
        return res.status(404).json({ error: "User id is required" });
    }
    try {
        // Fetch videos for the authenticated user
        const videos = await Video.find({ uploader: userId })
            .populate('channelId')
            .sort({ uploadDate: -1 }) // Sort by upload date in descending order
            .select('-__v');  // Optionally exclude unwanted fields like `__v`

        res.status(200).json({ videos });  // Send the videos back in the response
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

        const video = await Video.findById(videoId)
            .populate({
                path: "comments",
                options: { sort: { createdAt: -1 } },
                populate: [
                    { path: "userId", select: "avatar" },
                    { path: "channelId", select: "handle" }
                ]
            })
            .populate('uploader', 'avatar')
            .populate("channelId").select('-__v');

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

        const tags = generateTags(updateData.title, updateData.description);

        // Perform the update with updated fields only
        const updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            { $set: { ...updateData, tags } },
            { new: true, runValidators: true },

        );

        // Respond with the updated video
        res.json({ message: "Video updated successfully.", video: updatedVideo });
    } catch (error) {
        console.error("Error updating video:", error);
        res.status(500).json({ error: "Internal server error. Could not update the video." });
    }
};


export const searchVideos = async (req, res) => {
    try {
        // Validate the query parameter
        const { error, value } = searchSchema.validate(req.query, { abortEarly: false });

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // 2. Sanitize and prepare the search query (basic sanitization)
        const searchTitle = value.title.trim(); // Trim spaces from the search string

        // 3. Perform the search (case-insensitive)
        const videos = await Video.find({
            title: { $regex: searchTitle, $options: "i" }, // 'i' for case-insensitive
        })
            .populate('uploader', 'avatar')
            .populate("channelId", "channelName").select('-__v');

        // 4. Check if there are results
        if (!videos || videos.length === 0) {
            return res.status(404).json({ error: "No videos found" });
        }

        // 5. Return the search results
        return res.status(200).json({ videos });
    } catch (err) {
        console.error("Error searching videos:", err);
        return res.status(500).json({ error: "An error occurred while searching videos" });
    }
};


export const getRecommendedVideos = async (req, res) => {
    try {
        const { videoId } = req.params;

        // Fetch the current video
        const currentVideo = await Video.findById(videoId);

        if (!currentVideo) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Find videos with at least one matching tag (excluding the current video)
        const recommendedVideos = await Video.find({
            _id: { $ne: videoId }, // Exclude current video
            tags: { $in: currentVideo.tags }, // Match at least one tag
        })
            .populate("channelId", "channelName")
            .select('-__v')
            .sort({ createdAt: -1 })
            .limit(10); // Limit to 10 recommendations


        res.status(200).json(recommendedVideos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



export const getFilteredVideos = async (req, res) => {
    try {
        const { category } = req.params;  // or use req.query.category for query params

        // Initialize the filter object
        let filter = {};

        // Apply the filter only if the category is not "All"
        if (category && category !== "All") {
            filter.category = category;
        }

        // Fetch the videos from the database based on the filter
        const videos = await Video.find(filter)
            .populate('uploader', 'avatar')
            .populate("channelId", "channelName").select('-__v')
            .sort({ createdAt: -1 });  // This applies the filter condition

        // Send back the filtered videos
        res.status(200).json({ videos });

    } catch (error) {
        // Log and return an error if something goes wrong
        console.error('Error fetching filtered videos:', error);
        res.status(500).json({ message: 'Error fetching videos, please try again later' });
    }
};