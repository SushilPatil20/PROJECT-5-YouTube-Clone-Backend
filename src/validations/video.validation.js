import Joi from "joi";

const videoValidationSchema = Joi.object({
    title: Joi.string()
        .min(5)
        .max(100)
        .required()
        .messages({
            "string.base": "Title must be a string",
            "string.empty": "Title is required",
            "string.min": "Title should have at least 5 character",
            "string.max": "Title should have at most 100 characters",
        }),

    videoUrl: Joi.string()
        .uri()
        .required()
        .messages({
            "string.base": "Video URL must be a string",
            "string.empty": "Video URL is required",
            "string.uri": "Video URL must be a valid URL",
        }),

    thumbnailUrl: Joi.string()
        .uri()
        .required()
        .messages({
            "string.base": "Thumbnail URL must be a string",
            "string.empty": "Thumbnail URL is required",
            "string.uri": "Thumbnail URL must be a valid URL",
        }),

    description: Joi.string()
        .max(1000)
        .allow("")
        .messages({
            "string.base": "Description must be a string",
            "string.max": "Description should have at most 1000 characters",
        }),

    uploader: Joi.string()
        .required()
        .messages({
            "string.base": "Uploader ID must be a string",
            "string.empty": "Uploader ID is required",
        }),

    channelId: Joi.string()
        .required()
        .messages({
            "string.base": "Channel ID must be a string",
            "string.empty": "Channel ID is required",
        }),

    views: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .messages({
            "number.base": "Views must be a number",
            "number.min": "Views must be at least 0",
        }),

    likes: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .messages({
            "number.base": "Likes must be a number",
            "number.min": "Likes must be at least 0",
        }),

    dislikes: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .messages({
            "number.base": "Dislikes must be a number",
            "number.min": "Dislikes must be at least 0",
        }),

    comments: Joi.array()
        .items(Joi.object())
        .default([])
        .messages({
            "array.base": "Comments must be an array",
        }),
});
export default videoValidationSchema;





// Joi.object({
//     userId: Joi.string().required().messages({
//         "string.base": "User ID must be a string",
//         "string.empty": "User ID is required",
//     }),
//     content: Joi.string().max(500).required().messages({
//         "string.base": "Content must be a string",
//         "string.empty": "Content is required",
//         "string.max": "Content should have at most 500 characters",
//     }),
//     timestamp: Joi.date().default(() => new Date()).messages({
//         "date.base": "Timestamp must be a valid date",
//     }),
// })