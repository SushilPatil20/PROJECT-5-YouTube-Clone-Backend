
import Channel from "../models/channel.model.js"
import User from "../models/user.model.js"
import { deleteCloudinaryFile } from "../utils/helpers.js"
import channelValidationSchema from "../validations/channel.validation.js"
import mongoose from "mongoose"
// {
//     "channelId": "channel01",         // will be provided by the database
//     "channelName": "Code with John",  // Take from the user
//     "owner": "user01",                // auth user ID
//     "description": "Coding tutorials and tech reviews by John Doe.", // take from the user
//     "channelBanner": "https://example.com/banners/john_banner.png", // take from the user
//     "subscribers": 5200,   // add the default
//     "videos": ["video01","video02"] // empty array at first
// }

export const createChannel = async (req, res) => {
    const channelData = req.body
    const userId = req.user

    const { error } = channelValidationSchema.validate(channelData, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            details: error.details.map((err) => err.message)
        });
    }

    try {
        const existingChannel = await Channel.findOne({
            $or: [
                { channelName: { $regex: `^${channelData.channelName}$`, $options: "i" } },
                { handle: { $regex: `^${channelData.handle}$`, $options: "i" } }
            ]
        });

        if (existingChannel) {
            return res.status(409).json({
                message: "Channel name or handle is already in use. Please choose another."
            });
        }

        const newChannel = await Channel.create({ ...channelData, owner: userId })

        await User.findByIdAndUpdate(
            userId,
            { $push: { channels: newChannel._id } },
        )

        return res.status(201).json({
            message: "Channel created successfully!",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "An error occurred while creating the channel. Please try again.",
            error: error.message
        });
    }
}



export const getChannelById = async (req, res) => {

    const { channelId } = req.params; // Channel identifier from the URL params


    try {
        // Find channel by ID or handle
        const channel = await Channel.findOne({ _id: channelId })
            .populate('owner', 'name email')

        // ---------- Uncomment this after creating the video model ----------
        // .populate('videos', 'title views likes') // Populate video details with selected fields

        if (!channel) {
            return res.status(404).json({
                message: "Channel not found."
            });
        }

        // Return channel data
        return res.status(200).json({
            message: "Channel retrieved successfully.",
            channel: channel
        });
    } catch (error) {
        console.error("Error retrieving channel:", error);
        return res.status(500).json({
            message: "An error occurred while retrieving the channel.",
            error: error.message
        });
    }
};


/**
 * Controller to fetch channel details by its handle.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getChannelByHandle = async (req, res) => {
    const { handle } = req.params;

    // Validate the handle parameter
    if (!handle || typeof handle !== "string") {
        return res.status(400).json({ message: "Invalid channel handle provided" });
    }

    try {
        // Fetch channel details
        const channel = await Channel.findOne({ handle }).populate({
            path: "owner",
            select: "-password",
        }).populate('videos');


        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        // Respond with channel details
        res.status(200).json(channel);
    } catch (error) {
        console.error(`Error fetching channel with handle ${handle}:`, error); // Server-side logging
        res.status(500).json({
            message: "Internal server error while fetching channel",
            error: error.message
        });
    }
};











export const updateChannel = async (req, res) => {
    const { channelId } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return res.status(400).json({ error: "Invalid channel ID format." });
        }

        const channel = await Channel.findById(channelId);
        if (!channel) return res.status(404).json({ error: 'Channel not found' });

        const handle = channel.handle
        const channelName = req.body.channelName || channel.channelName
        const description = req.body.description || channel.description

        // Initialize the object with the fields that can be updated (exclude handle and owner)
        const updatedData = { handle, channelName, description };

        // Validate the updated data
        const { error } = channelValidationSchema.validate(updatedData, { abortEarly: false });
        // console.log("These are the errors : ", error)
        if (error) return res.status(400).json({ details: error.details.map(err => err.message) });


        // Handle file upload for the channel banner if provided
        if (req.files?.channelBanner) {
            await deleteCloudinaryFile(channel.channelBanner, "image")
            updatedData.channelBanner = req.files.channelBanner;
        }

        // Only update if there are changes in the data
        const updatedChannel = await Channel.findByIdAndUpdate(
            channelId,
            { $set: updatedData },
            { new: true }
        );

        return updatedChannel ?
            res.status(200).json({ message: 'Channel updated successfully', channel: updatedChannel }) :
            res.status(400).json({ message: 'No new data to update' });

    } catch (error) {
        return res.status(500).json({ error: 'Failed to update channel', details: error.message });
    }
};
