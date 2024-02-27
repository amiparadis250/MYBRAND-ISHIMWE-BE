const getTokenFromHeader = (req) => {
    try {
        const authorizationHeader = req.headers['authorization'];

        if (!authorizationHeader) {
            throw new Error('Authorization header is missing');
        }

        const token = authorizationHeader.split(' ')[1];

        if (!token) {
            throw new Error('Token is missing');
        }

        return token;
    } catch (error) {
        console.log("Failed to get token from");
        // Handle the error, log it, or throw a custom error
        // console.error(`Error in getTokenFromHeader: ${error.message}`);
        return null; // or throw an error if you prefer
    }
};

export default getTokenFromHeader;
