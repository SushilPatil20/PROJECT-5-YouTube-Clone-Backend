import mongoose from "mongoose";
import { commentSchema } from "./comment.model.js"

const videoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        default: ""
    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true,
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },
    comments: {
        type: [commentSchema],
        default: [],
    }
}, { timestamps: true });
const Video = mongoose.model("Video", videoSchema);
export default Video;
