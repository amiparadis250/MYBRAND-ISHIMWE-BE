// validations/blogValidations.ts
import Joi from 'joi';

export const createBlogValidation = Joi.object({
    title: Joi.string().required().max(255),
    desc: Joi.string().required().max(500),
    content: Joi.string().required().max(5000),

});

export const updateBlogValidation = Joi.object({
    title: Joi.string().max(255),
    description: Joi.string().max(500),
    content: Joi.string().max(5000),
});




