
import Channel from "../models/channel.model.js"
import channelValidationSchema from "../validations/channel.validation.js"
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
    const channelBanner = req.file?.channelBanner || null
    const { error } = channelValidationSchema.validate(channelData, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            details: error.details.map((err) => err.message)
        });
    }

    try {
        const existingChannel = await Channel.findOne({
            $or: [{ channelName: channelData.channelName }, { handle: channelData.handle }]
        })

        if (existingChannel) {
            return res.status(409).json({
                message: "Channel name or handle is already in use. Please choose another."
            });
        }

        const newChannel = await Channel.create({
            ...channelData,
            channelBanner: channelBanner
        })

        return res.status(201).json({
            message: "Channel created successfully!",
            channel: newChannel
        });
    }
    catch (error) {
        console.error("Error creating channel:", error);
        return res.status(500).json({
            message: "An error occurred while creating the channel. Please try again.",
            error: error.message
        });
    }
}



export const getChannel = async (req, res) => {
    const { channelId } = req.params; // Channel identifier from the URL params
    try {
        // Find channel by ID or handle
        const channel = await Channel.findOne({ _id: channelId })
            .populate('owner', 'name email') // Populate owner details, selecting specific fields
        // ---------- Uncomment this after creating the video model ----------
        // .populate('videos', 'title views likes') // Populate video details with selected fields

        // Check if channel exists
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

