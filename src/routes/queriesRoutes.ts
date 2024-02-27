// querriesRoutes.js
import express from 'express';
import {
    createQuery,
    getAllQueries,
    simpleQuerries,
    deleteQuerries
} from '../controllers/querriesCtrl';
import isAdmin from '../middlewares/isAdmin';
import { isLogin } from '../middlewares/isLogin';
import querryValidation from '../validations/QuerriesValidation'

const router = express.Router();

router.post('/', querryValidation, createQuery);
router.get('/',isLogin,isAdmin, getAllQueries);
router.get('/:id',isLogin,isAdmin, simpleQuerries);  
router.delete('/:id',isAdmin,deleteQuerries);

export default router;
