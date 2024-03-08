// Blogs.ts
import mongoose, { Document, Schema } from "mongoose";
import { CommentModel } from "../model/Comments";


export interface BlogModel extends Document {
    title: string;
    imgsrc: string;
    desc: string;
    content: string;
    likes: number;
    dislikes: number;
    numViews: number;
    user: mongoose.Types.ObjectId;
    comments: CommentModel['_id'][];
}

const blogSchema = new Schema<BlogModel>({
    title: {
        type: String,
        required: [true, "Blog title is required"],
    },
    imgsrc: {
        type: String,
        required: [true, "Image source is required"],
    },
    desc: {
        type: String,
        required: [true, "Blog description is required"],
    },
    content: {
        type: String,
        required: [true, "Blog content is required"],
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    numViews: {
        type: Number,
        default: 0,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment', 
    }],
});

const Blog = mongoose.model<BlogModel>('Blog', blogSchema);
export default Blog;
