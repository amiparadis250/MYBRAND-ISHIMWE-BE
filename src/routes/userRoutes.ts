// userRoutes.js

import express from 'express'
import {  registerUser } from '../controllers/userCtl';
import { loginUser} from '../controllers/userCtl';
import { getUserProfileById } from '../controllers/userCtl';
import { getAllUsers } from '../controllers/userCtl';
import { deleteUserProfileById } from '../controllers/userCtl';
import {isLogin} from '../middlewares/isLogin';
import isAdmin from '../middlewares/isAdmin';
import usersValidation from '../validations/userValidation';

const userRoutes = express.Router();

userRoutes.post('/register',usersValidation,registerUser);
userRoutes.post('/login', loginUser);
userRoutes.get('/profile/',isLogin, getUserProfileById);
userRoutes.get('/',isLogin,isAdmin, getAllUsers);
userRoutes.delete('/profile/:id',isLogin,isAdmin, deleteUserProfileById);


export default userRoutes;
