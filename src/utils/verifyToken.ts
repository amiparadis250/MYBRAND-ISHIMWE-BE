import jwt from 'jsonwebtoken';




const VerifyToken = (token) => {
    if (!token) {
        return false;
    }

    return jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return false;
        } else {
            return decoded;
        }
    });
};

export default VerifyToken;
