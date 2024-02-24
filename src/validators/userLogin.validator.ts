import Joi from "joi";


export const userLoginValidatorSchema = Joi.object({
    emailId: Joi.string().email().optional().lowercase(),
    password: Joi.string().required(),
}).or("emailId", "phoneNumber");


