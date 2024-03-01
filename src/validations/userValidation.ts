import joi from 'joi';
export const  validateUserSchema= joi.object({
    email:joi.string().email().message("Enter a valid email address"),
    password:joi.string().min(12).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .message('Password must be at least 12 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character.'),
    fullName:joi.string().min(3).max(70).regex(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)
    .message('Your names must be between 3 and 70 characters and should not include special characters.'),
  })
  const usersValidation = async (req:any, res:any, next) => {
    const value = validateUserSchema.validate(req.body, { abortEarly: false });
    if (value.error) {
        return res.status(400).res.json({ error: value.error.details[0].message});
    } else {
        next();
    }
};

export default usersValidation;
    
