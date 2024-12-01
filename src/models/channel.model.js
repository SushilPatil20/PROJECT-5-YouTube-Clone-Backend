import mongoose from "mongoose";
const channelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true,
        trim: true,
    },
    handle: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
        },
    ],
    description: {
        type: String,
        trim: true,
        default: ""
    },
    channelBanner: {
        type: String,
        default: null,
    },
    subscribers: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
