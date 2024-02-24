import Joi from 'joi';

export const likeValidatorSchema = Joi.object({
    userId: Joi.string().required(),
    likedUserId: Joi.string().required()
});
