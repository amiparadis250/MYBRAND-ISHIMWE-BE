import express from 'express';
import {
    addComment,
    deleteComment,
    getOneComment,
    getAllCommentsForBlog,
    getAllCommentsGlobal
} from '../controllers/commentsCtl';
import { isLogin } from '../middlewares/isLogin';
import isAdmin from '../middlewares/isAdmin';

const commentRoutes = express.Router();

commentRoutes.post('/:id/comments', isLogin, addComment);
commentRoutes.delete('/:id/comments/:commentId', isLogin, isAdmin, deleteComment);
commentRoutes.get('/:id/comments/:commentId', getOneComment);
commentRoutes.get('/:id/comments', getAllCommentsForBlog);
commentRoutes.get('/comments', getAllCommentsGlobal);

export default commentRoutes;