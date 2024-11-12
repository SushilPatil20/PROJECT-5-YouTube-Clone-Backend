import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    avatar: {
        type: String,
        default: null
    },
    channels: [{
        type: mongoose.Schema.Types.ObjectId,  // Array of ObjectIds for referencing Channel documents
        ref: "Channel",
        default: []
    }],

}, { timestamps: true })

const User = mongoose.model("User", userSchema);
export default User;