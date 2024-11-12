import mongoose from "mongoose";

// Define a sub-schema for Comments
export const commentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

const Comment = mongoose.model("Comment", commentSchema)
export default Comment;