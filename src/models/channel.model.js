import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true,
        trim: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,  // References the _id of a User document
        ref: "User",
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    channelBanner: {
        type: String,
        default: null,
    },
    subscribers: {
        type: Number,
        default: 0,
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,  // Array of ObjectIds for related Video documents
        ref: "Video",
    }],
}, { timestamps: true });

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
