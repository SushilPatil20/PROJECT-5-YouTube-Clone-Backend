import Joi from "joi";

const searchSchema = Joi.object({
    title: Joi.string().min(1).required(), // Ensure title is a non-empty string
});

export default searchSchema