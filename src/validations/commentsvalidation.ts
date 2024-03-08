import joi from 'joi'

export const commentsValidationSchema = joi.object({
    text: joi.string().required().max(1000).trim().message('Please enter a valid comment'),
    commenterName: joi.string().required().max(255).regex(/^[A-Za-z\s]+$/).trim().message('Please enter a valid name without special characters'),
    commenterEmail: joi.string().email().required().max(255).trim().message('Please enter a valid email'),
});

const validateComments = async (req, res, next) => {
    const value = commentsValidationSchema.validate(req.body, { abortEarly: false });
    if (value.error) {
        return res.status(403).send({message:"Invalid comments details",error:value.error});
    } else {
        next();
    }
};
export default validateComments
