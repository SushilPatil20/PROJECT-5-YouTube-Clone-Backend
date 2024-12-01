import mongoose from "mongoose";

// Define a sub-schema for Comments
export const commentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true,
    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema)
export default Comment;