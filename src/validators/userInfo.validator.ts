import Joi from "joi";

export const userValidatorSchema = Joi.object({
    Name: Joi.string().required(),
    emailId: Joi.string().email().required().lowercase(),
    password: Joi.string().required(),
    github: Joi.string().optional(),
});

export const userIdentificationValidatorSchema = Joi.object({
    emailId: Joi.string().email().optional().lowercase(),
    _id: Joi.string().hex().length(24).optional(),
});

export const userUpdationValidationSchema = Joi.object({
    password: Joi.string().optional().allow("", null),
    _id: Joi.string().hex().length(24).required(),
    previousPassword: Joi.string().optional().allow("", null),
})
    .with("password", "previousPassword");