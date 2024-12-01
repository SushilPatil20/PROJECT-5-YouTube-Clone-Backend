import Joi from "joi";

const channelSchema = Joi.object({
    channelName: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.base": "Channel name must be a string",
            "string.empty": "Channel name is required",
            "string.min": "Channel name should have at least 3 characters",
            "string.max": "Channel name should have at most 50 characters",
        }),
    handle: Joi.string()
        .pattern(/^@[a-zA-Z0-9._-]+$/)
        .min(3)
        .max(30)
        .required()
        .messages({
            "string.base": "Handle must be a string",
            "string.empty": "Handle is required",
            "string.pattern.base": "Handle must start with '@' and can only contain letters, numbers, underscores, periods, or hyphens",
            "string.min": "Handle should have at least 3 characters",
            "string.max": "Handle should have at most 30 characters",
        }),
    description: Joi.string()
        .max(500)
        .allow("")
        .messages({
            "string.base": "Description must be a string",
            "string.max": "Description should have at most 500 characters",
        }),
    channelBanner: Joi.string()
        .uri()
        .optional()
        .messages({
            "string.uri": "Channel banner must be a valid URL",
        }),
    subscribers: Joi.number()
        .default(0)
        .messages({
            "number.base": "Subscribers count must be a number",
        }),
});

export default channelSchema;
