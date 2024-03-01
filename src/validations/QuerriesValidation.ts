import joi from 'joi'

    export const createQuerryValidationSchema = joi.object({
        email: joi.string().email().required(),
        guestName: joi.string().pattern(/^[a-zA-Z\s]{5,}$/).required(),
        guestQuery: joi.string().min(5).required(),
    });


const querryValidation = async (req, res, next) => {
    const value = createQuerryValidationSchema.validate(req.body, { abortEarly: false });
    if (value.error) {
        return res.status(403).send({message:"Invalid message details",error:value.error.details[0].message});
    } else {
        next();
    }
};
export default querryValidation
