
//middleware isAdmin.ts
import User from '../model/User'
import getTokenFromHeader from "../utils/getTokenFromHeader";
import VerifyToken from "../utils/verifyToken";

export const isAdmin = async (req, res, next) => {
    const token = getTokenFromHeader(req);
    
    // Verify token
    const decodedUser = VerifyToken(token);
   //  console.log(decodedUser);
   req.userAuth =decodedUser.id
 const user =await User.findById(decodedUser.id);
 if(user.isAdmin){
    return next()
 }
 else{
    return res.json({
        status: 'error',
        message: 'Acess denied, Only admin is allowed',
    });
 }
}
export default isAdmin;
   
 