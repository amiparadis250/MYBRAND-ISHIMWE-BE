import { Request, Response } from 'express';
import mongoose from 'mongoose';
import query from '../model/querries';
export const createQuery =async (req: Request, res: Response) =>{
    //cretaing query logic
    const {guestName,guestQuery,email} = req.body;
    const messages= await query.create(
        {
            guestName,
            guestQuery,
            email
        }
    )
    try {
        res.json({
            status:'success',
            data: messages,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'err.message'
        });
    }
}

export const getAllQueries =async (req: Request, res: Response) =>{
    //getting all queries logic
    const allQueries = await query.find()
    try {
        res.json({
            status:'success',
            data: allQueries,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'err.message',
        });
    }
}
export const simpleQuerries = async (req: Request, res: Response) => {
    // getting single query
    const {id} = req.params;
    try {
        const singleQuery = await query.findById(id);
        res.json({
            status: 'success',
            data: singleQuery,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
}
//deketed querries
export const  deleteQuerries = async (req: Request, res: Response)=>{
    const{id}= req.params;
    try{
        const deletedQuery = await query.findByIdAndDelete(id);
        if(!deletedQuery){
            return res.status(404).json({
                status: 'error',
                message: 'Query not found',
            });
        }
        res.json({
            status:'success',
            data: "message successfully deleted",
        });
    }
    
    catch(err){
        res.status(500).json({
            status: 'failed',
            message: err.message,
        });
    }

}