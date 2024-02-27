// middleware/isLOGIN.ts


import jwt from 'jsonwebtoken';
import VerifyToken from "../utils/verifyToken";
import getTokenFromHeader from '../utils/getTokenFromHeader';

import { Request as ExpressRequest, Response, NextFunction } from 'express';

// Extend the Express Request type to include userAuth
interface RequestWithUserAuth extends ExpressRequest {
    userAuth?: string; // Adjust the type as needed
}

export const isLogin = (req: RequestWithUserAuth, res: Response, next: NextFunction) => {
    const token = getTokenFromHeader(req);
    // console.log('Token:', token);
    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized. Token not provided.',
        });
    }

    const decodedUser = VerifyToken(token);

    if (!decodedUser) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized. Invalid token or expired.',
        });
    }

    req.userAuth = decodedUser.id;
   
    next();
};
