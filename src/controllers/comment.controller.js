import commentSchema from "../validations/comment.validation.js";
import Comment from "../models/comment.model.js";
import Video from "../models/video.model.js";
import User from "../models/user.model.js";
import Channel from "../models/channel.model.js";
import mongoose from "mongoose";

// -------------- Function to create a new comment --------------
export const createComment = async (req, res) => {
    const commentData = req.body;

    // -------------- Validate the comment data using the defined validation schema --------------
    const { error } = commentSchema.validate(commentData, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            details: error.details.map((err) => err.message),
        });
    }

    try {
        // -------------- Check if the video exists --------------
        const video = await Video.findById(commentData.videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found." });
        }

        // -------------- Check if the user exists --------------
        const user = await User.findById(commentData.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // -------------- Check if the channel exists --------------
        const channel = await Channel.findById(commentData.channelId);
        if (!channel) {
            return res.status(404).json({ message: "Channel not found." });
        }

        // -------------- Create a new comment --------------
        const newComment = await Comment.create({
            userId: commentData.userId,
            videoId: commentData.videoId,
            channelId: commentData.channelId,
            text: commentData.text,
        });

        // -------------- Add the new comment to the video's comments array --------------
        video.comments.push(newComment._id);
        await video.save();

        // -------------- Return a success response with the newly created comment --------------
        return res.status(201).json({
            message: "Comment created successfully!",
            comment: newComment,
        });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid video or user ID." });
        }

        return res.status(500).json({
            message: "An error occurred while creating the comment. Please try again.",
            error: err.message,
        });
    }
};

// -------------- Function to get all comments for a specific video --------------
export const getComments = async (req, res) => {
    try {
        const { videoId } = req.params; // -------------- Extract videoId from the request parameters

        // -------------- Fetch comments for the specific videoId
        const comments = await Comment.find({ videoId })
            .sort({ createdAt: -1 }) // Sort comments by latest first
            .populate('userId', 'name avatar') // --------------  Populate user details if referenced
            .exec();

        if (!comments || comments.length === 0) {
            return res.status(404).json({ message: "No comments found for this video." });
        }

        // -------------- Send the comments as a response
        res.status(200).json(comments);
    } catch (error) {
        console.error(error); // -------------- Log any errors
        res.status(500).json({ message: "Error fetching comments." });
    }
};

// Function to delete a comment
export const deleteComment = async (req, res) => {
    const { commentId } = req.params; // -------------- Extract commentId from the route
    const userId = req.user; // -------------- The ID of the user making the request

    try {
        // -------------- Check if the commentId is a valid ObjectId --------------
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ error: "Invalid video ID format." });
        }

        // -------------- Find the comment by ID --------------
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found." });
        }

        // -------------- Check if the user is authorized to delete the comment --------------
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ error: "Unauthorized to delete this comment." });
        }

        // -------------- Delete the comment --------------
        await Comment.findByIdAndDelete(commentId);

        // -------------- Remove the comment from the associated video --------------
        await Video.findByIdAndUpdate(comment.videoId, {
            $pull: { comments: commentId },
        });

        return res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

// Function to update a comment
export const updateComment = async (req, res) => {
    const { commentId } = req.params; // -------------- Extract commentId from the route
    const { text } = req.body; // -------------- Extract the new text from the request body

    // -------------- Find the existing comment --------------
    const comment = await Comment.findById(commentId);

    if (!comment) {
        return res.status(404).json({ message: "Comment not found." });
    }

    const updatedData = {
        text: text || comment.text, // -------------- Set new text, or keep the existing one if no new text provided --------------
        channelId: comment.channelId.toString(),
        userId: comment.userId.toString(),
        videoId: comment.videoId.toString(),
    };

    //  -------------- Validate the updated comment data using the schema --------------
    const { error } = commentSchema.validate(updatedData, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            details: error.details.map((err) => err.message),
        });
    }

    try {
        // -------------- Check if the video exists --------------
        const video = await Video.findById(comment.videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found." });
        }

        // -------------- Check if user exists --------------
        const user = await User.findById(comment.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // -------------- Check if the channel exists --------------
        if (comment.channelId) {
            const channel = await Channel.findById(comment.channelId);
            if (!channel) {
                return res.status(404).json({ message: "Channel not found." });
            }
        }

        // -------------- Define which fields are allowed to be updated --------------
        const allowedUpdates = ["text"];
        Object.keys(updatedData).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                comment[key] = updatedData[key];
            }
        });

        // -------------- Save the updated comment --------------
        const updatedComment = await comment.save();

        return res.status(200).json({
            message: "Comment updated successfully!",
            comment: updatedComment,
        });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid comment, video, or user ID." });
        }

        return res.status(500).json({
            message: "An error occurred while updating the comment. Please try again.",
            error: err.message,
        });
    }
};
