import joi from 'joi';
export const createQuerryValidationSchema =joi.object({
    email: joi.string().email().required(),
    guestName: joi.string().pattern(/^[a-zA-Z\s]{5,}$/).required(),
    guestQuery: joi.string().min(10).required(),
    });


const querryValidation = async (req, res, next) => {
    const value = createQuerryValidationSchema.validate(req.body, { abortEarly: false });
    if (value.error) {
        return res.status(403).send({message:"Invalid message details",error:value.error});
    } else {
        next();
    }
};
export default querryValidation
