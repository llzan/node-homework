// USER SCHEMA

const Joi = require("joi");

const userSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    name: Joi.string().trim().min(3).max(30).required(),
    password: Joi.string()
    .trim()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-zA-z)-0]).+$/)
    .messages({
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    })
    .required(),
});

module.exports = { userSchema };

