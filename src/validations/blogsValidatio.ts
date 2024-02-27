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

// export const addCommentValidation = Joi.object({
//     text: Joi.string().required().max(1000),
//     commenterName: Joi.string().required().max(255),
//     commenterEmail: Joi.string().email().required().max(255),
// });

// export const updateCommentValidation = Joi.object({
//     text: Joi.string().max(1000),
//     commenterName: Joi.string().max(255),
//     commenterEmail: Joi.string().email().max(255),
// });


