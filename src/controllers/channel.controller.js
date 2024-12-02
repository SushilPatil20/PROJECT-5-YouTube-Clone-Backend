import Channel from "../models/channel.model.js"
import User from "../models/user.model.js"
import { deleteCloudinaryFile } from "../utils/helpers.js"
import channelValidationSchema from "../validations/channel.validation.js"
import mongoose from "mongoose"

// ---------------- Controller to create a new channel ----------------
export const createChannel = async (req, res) => {
    const channelData = req.body
    const userId = req.user // The authenticated user's ID

    // Validate the provided channel data against the validation schema
    const { error } = channelValidationSchema.validate(channelData, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            details: error.details.map((err) => err.message)
        });
    }

    try {
        // Check if the channel name or handle already exists in the database
        const existingChannel = await Channel.findOne({
            $or: [
                { channelName: { $regex: `^${channelData.channelName}$`, $options: "i" } },
                { handle: { $regex: `^${channelData.handle}$`, $options: "i" } }
            ]
        });

        // Return an error if the channel name or handle is already in use
        if (existingChannel) {
            return res.status(409).json({
                message: "Channel name or handle is already in use. Please choose another."
            });
        }

        // Create a new channel with the provided data and assign the current user as the owner
        const newChannel = await Channel.create({ ...channelData, owner: userId })

        // Add the newly created channel to the user's channels array
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

// ---------------- Controller to retrieve channel by its ID ----------------
export const getChannelById = async (req, res) => {
    const { channelId } = req.params; // Channel identifier from the URL params

    try {
        // Find channel by ID and populate owner details (name, email)
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

// ---------------- Controller to fetch channel details by its handle ----------------
export const getChannelByHandle = async (req, res) => {
    const { handle } = req.params;

    // Validate the handle parameter
    if (!handle || typeof handle !== "string") {
        return res.status(400).json({ message: "Invalid channel handle provided" });
    }

    try {
        // Fetch channel details using handle and populate owner and videos
        const channel = await Channel.findOne({ handle }).populate({
            path: "owner",
            select: "-password", // Exclude password field from owner data
        }).populate('videos');  // Populate video details as well

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

// ---------------- Controller to update a channel ----------------
export const updateChannel = async (req, res) => {
    const { channelId } = req.params;

    try {
        // Check if the channel ID is valid using Mongoose's ObjectId validator
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return res.status(400).json({ error: "Invalid channel ID format." });
        }

        // Find the channel by its ID
        const channel = await Channel.findById(channelId);
        if (!channel) return res.status(404).json({ error: 'Channel not found' });

        const handle = channel.handle // Retain the current handle as it cannot be changed
        const channelName = req.body.channelName || channel.channelName // Update channelName if provided
        const description = req.body.description || channel.description // Update description if provided

        // Prepare the object with the fields to be updated (excluding handle and owner)
        const updatedData = { handle, channelName, description };

        // Validate the updated data
        const { error } = channelValidationSchema.validate(updatedData, { abortEarly: false });
        if (error) return res.status(400).json({ details: error.details.map(err => err.message) });

        // Handle file upload for the channel banner if provided
        if (req.files?.channelBanner) {
            // Delete the old banner from Cloudinary before updating with the new one
            await deleteCloudinaryFile(channel.channelBanner, "image")
            updatedData.channelBanner = req.files.channelBanner; // Assign new banner to updatedData
        }

        // Update the channel if there are changes
        const updatedChannel = await Channel.findByIdAndUpdate(
            channelId,
            { $set: updatedData },
            { new: true } // Return the updated document
        );

        // Respond with a success message if the update was successful, otherwise notify no new data
        return updatedChannel ?
            res.status(200).json({ message: 'Channel updated successfully', channel: updatedChannel }) :
            res.status(400).json({ message: 'No new data to update' });

    } catch (error) {
        // Catch and handle any errors that occur during the update process
        return res.status(500).json({ error: 'Failed to update channel', details: error.message });
    }
};
