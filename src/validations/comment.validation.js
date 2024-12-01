import Joi from "joi";

const commentSchema = Joi.object({
    text: Joi.string().min(1).required().messages({
        "string.empty": "Comment text cannot be empty.",
        "any.required": "Comment text is required.",
    }),
    channelId: Joi.string().required().messages({
        "string.empty": "User ID is required.",
        "any.required": "User ID is required.",
    }),
    userId: Joi.string().required().messages({
        "string.empty": "User ID is required.",
        "any.required": "User ID is required.",
    }),
    videoId: Joi.string().required().messages({
        "string.empty": "Video ID is required.",
        "any.required": "Video ID is required.",
    }),
});
export default commentSchema