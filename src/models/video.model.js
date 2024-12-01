import mongoose from "mongoose";

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
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
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
    tags: { type: [String], default: [] },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ]

}, { timestamps: true });
const Video = mongoose.model("Video", videoSchema);
export default Video;
