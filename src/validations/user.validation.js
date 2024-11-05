import Joi from "joi";
const userValidationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            "string.base": "Username must be a string",
            "string.empty": "Username is required",
            "string.min": "Username should have at least 3 characters",
            "string.max": "Username should have at most 30 characters",
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.base": "Email must be a string",
            "string.empty": "Email is required",
            "string.email": "Email must be a valid email address",
        }),

    password: Joi.string()
        .min(8)
        .max(50)
        .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])"))
        .required()
        .messages({
            "string.base": "Password must be a string",
            "string.empty": "Password is required",
            "string.min": "Password should have at least 8 characters",
            "string.max": "Password should have at most 50 characters",
            "string.pattern.base":
                "Password must contain at least one letter and one number",
        }),

    // Avatar is optional and validated by Multer separately
});
export default userValidationSchema;