// Comment.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface CommentModel extends Document {
    text: string;
    commenterName: string;
    commenterEmail: string;
    date: Date;
    hidden?: boolean;
    blog: mongoose.Types.ObjectId;
}

const commentSchema = new Schema<CommentModel>({
    text: {
        type: String,
        required: [true, 'Comment text is required'],
    },
    commenterName: {
        type: String,
        required: [true, 'Commenter name is required'],
    },
    commenterEmail: {
        type: String,
        required: [true, 'Commenter email is required'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    hidden: {
        type: Boolean,
        default: false,
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog', // Assuming your Blog model is named 'Blog'
    },
});

var Comment;
if (mongoose.models.Comment) {
    Comment = mongoose.model('Comment');
} else {
    Comment = mongoose.model<CommentModel>('Comment', commentSchema);
}

export default Comment;
