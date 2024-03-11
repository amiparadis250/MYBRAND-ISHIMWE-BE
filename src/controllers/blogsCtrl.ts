import { Request, Response } from 'express';
import cloudinary, { UploadApiResponse } from 'cloudinary';
import { CloudinaryStorage} from 'multer-storage-cloudinary';
import Params from "multer-storage-cloudinary"
import Blog from '../model/Blogs';
import { Buffer } from 'buffer';
import multer from 'multer';
import { MulterFile } from 'multer';
import { Readable } from 'stream';
import User from '../model/User';

// Configure Cloudinary (importing configuration from cloudinary.js)
import cloudinaryConfig from '../Config/cloudinary';

// Apply Cloudinary configuration
cloudinary.v2.config(cloudinaryConfig);

// Interface for the folder parameter
interface Folders {
    folder: string;
}

// Extending UploadApiResponse to include 'folder'
interface CustomParams extends UploadApiResponse, Folders {}

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary as any, // Use 'any' type here
    params: {
        folder: 'MYBRAND',
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    } as Folders
});

// Set up multer middleware for handling file uploads
const upload = multer({ storage: storage });

// Function to upload image to Cloudinary
export const uploadImageToCloudinary = async (buffer: Buffer): Promise<string> => {
    try {
        // Check if the buffer is empty
        if (!buffer || buffer.length === 0) {
            throw new Error('Error uploading image to Cloudinary: Empty file');
        }

        // Use the uploader.upload_stream method to directly get the secure URL
        const result = await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) {
                        reject(`Error uploading image to Cloudinary: ${error.message}`);
                    } else {
                        resolve(result as cloudinary.UploadApiResponse);
                    }
                }
            );

            // Pipe the buffer to the upload stream
            const bufferStream = new Readable();
            bufferStream.push(buffer);
            bufferStream.push(null);
            bufferStream.pipe(uploadStream);
        });

        // Return the secure URL
        return result.secure_url;
    } catch (error) {
        throw new Error(error.message);
    }
};




// Function to delete image from Cloudinary
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.v2.uploader.destroy(publicId);
    } catch (error) {
        console.error(`Error deleting image from Cloudinary: ${error.message}`);
    }
};


export const createBlog = async (req: Request & { file: MulterFile, userAuth: string }, res: Response) => {
    const { title, desc, content } = req.body;

    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                message: 'No file was uploaded.',
            });
        }

        // Check if the user is authenticated and an admin
        if (!req.userAuth) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized. Authentication required.',
            });
        }

        const user = await User.findById(req.userAuth);

        if (!user || !user.isAdmin) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied. Only admin is allowed to create blogs.',
            });
        }

        const imgsrc = await uploadImageToCloudinary(req.file.buffer);

        const blog = await Blog.create({
            title,
            imgsrc,
            desc,
            content,
            user: req.userAuth,
        });

        res.json({
            status: 'success',
            data: {
                ...blog.toObject(),
                imgsrc: blog.imgsrc,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error.',
        });
    }
};

export const updateBlogById = async (req: Request & { file: MulterFile, userAuth: string }, res: Response) => {
    const { title, desc, content } = req.body;

    try {
        // Check if the user is authenticated and an admin
        if (!req.userAuth) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized. Authentication required.',
            });
        }

        const user = await User.findById(req.userAuth);

        if (!user || !user.isAdmin) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied. Only admin is allowed to update blogs.',
            });
        }

        let imgsrc;

        if (req.file) {
            imgsrc = await uploadImageToCloudinary(req.file.buffer);
        }

        const updateFields: { [key: string]: any } = {
            title,
            desc,
            content,
        };

        if (imgsrc) {
            updateFields.imgsrc = imgsrc;
        }

        // Update the blog with the new image URL (if provided)
        const blogId = req.params.id;
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            updateFields,
            { new: true }
        );

        res.json({
            status: 'success',
            data: updatedBlog,
            message: 'Blog updated successfully.',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error.',
        });
    }
};

export const getBlogById = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    try {
        const blog = await Blog.findById(blogId).populate('comments');
        res.json({
            status: 'success',
            data: blog,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

export const getAllBlogs = async (req: Request, res: Response) => {
    try {
        const blogs = await Blog.find().populate('comments');
        res.json({
            status: 'success',
            data: blogs,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

export const deleteBlogById = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    try {
        await Blog.findByIdAndDelete(blogId);
        res.json({
            status: 'success',
            data: 'Delete post route',
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

export const likeBlog = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { $inc: { likes: 1 } },
            { new: true }
        );
        res.json({
            status: 'success',
            data: updatedBlog,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

export const dislikeBlog = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { $inc: { dislikes: 1 } },
            { new: true }
        );
        res.json({
            status: 'success',
            data: updatedBlog,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

export const viewBlog = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { $inc: { numViews: 1 } },
            { new: true }
        );
        res.json({
            status: 'success',
            data: updatedBlog,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};
