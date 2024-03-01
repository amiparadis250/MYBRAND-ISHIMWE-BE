// Import necessary modules and functions
import { Request, Response } from 'express';
import Blog from "../model/Blogs"; 
import Comment,{CommentModel} from "../model/Comments"; 

export const addComment = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const { text, commenterName, commenterEmail } = req.body;

    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                status: 'error',
                message: 'Blog not found',
            });
        }

        // Create a new comment
        const newComment = await Comment.create({
            text,
            commenterName,
            commenterEmail,
        });

        // Add the entire comment object to the blog's comments array
        blog.comments.push(newComment.toObject());

        // Save the updated blog
        await blog.save();

        // Populate comments before responding
        await blog.populate('comments');

        // Respond with success and the updated comments array
        res.json({
            status: 'success',
            data: blog.comments,
        });
    } catch (err) {
        console.error('Error in addComment:', err);
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

export const getOneComment = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const commentId = req.params.commentId;

    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                status: 'error',
                message: 'Blog not found',
            });
        }

        // Populate comments before finding the comment
        await blog.populate('comments');

        // Find the comment by ID within the comments array
        const foundComment = blog.comments.find(comment => comment._id.toString() === commentId);

        if (!foundComment) {
            return res.status(404).json({
                status: 'error',
                message: 'Comment not found',
            });
        }

        // Respond with success and the found comment
        res.json({
            status: 'success',
            data: foundComment,
        });
    } catch (err) {
        console.error('Error in getOneComment:', err);
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

export const getAllComments = async (req: Request, res: Response) => {
    const blogId = req.params.id;

    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                status: 'error',
                message: 'Blog not found',
            });
        }

        // Populate comments before responding
        await blog.populate('comments');

        // Fetch all comments without skipping any
        const allComments = blog.comments;

        // Respond with success and the entire comments collection
        res.json({
            status: 'success',
            data: allComments,
        });
    } catch (err) {
        console.error('Error in getAllComments:', err);
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

export const getAllCommentsGlobal = async (req: Request, res: Response): Promise<void> => {
    try {
        const allComments: CommentModel[] = await Comment.find();

        res.json({
            status: 'success',
            data: allComments,
        });
    } catch (err) {
        console.error('Error in geting AllComments:', err);
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

export const getAllCommentsForBlog = async (req: Request, res: Response) => {
    const blogId = req.params.id;

    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                status: 'error',
                message: 'Blog not found',
            });
        }

        // Populate comments before responding
        await blog.populate('comments');

        // Respond with success and the comments for the specific blog
        res.json({
            status: 'success',
            data: blog.comments,
        });
    } catch (err) {
        console.error('Error in getAllCommentsForBlog:', err);
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const commentId = req.params.commentId;

    try {
        // Find the blog by ID
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                status: 'error',
                message: 'Blog not found',
            });
        }

        // Remove the comment by ID from the comments array
        blog.comments = blog.comments.filter(comment => comment._id.toString() !== commentId);

        // Save the updated blog
        await blog.save();

        // Populate comments before responding
        await blog.populate('comments');

        // Respond with success and the updated comments array
        res.json({
            status: 'success',
            data: blog.comments,
        });
    } catch (err) {
        console.error('Error in deleteComment:', err);
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};
