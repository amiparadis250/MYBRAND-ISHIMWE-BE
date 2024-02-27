import express from 'express';
import mongoose from 'mongoose';

//craating querries schema
const querriesSchema = new mongoose.Schema({
guestName:{
    type:String,
    required:[true,'name is required']
},
guestQuery:{
    type:String,
    required:[true,'comments are required']
},
email:{
type:String,
required:[true,'email is required'],
},
date:{
    type:Date,
    default:Date.now
}

});
const query = mongoose.model('model',querriesSchema);
export default query;
