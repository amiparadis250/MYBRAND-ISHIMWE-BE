// routes/Blogs/allRoutes.js
import express from 'express';
import multer from 'multer';
import { createBlogValidation  } from '../validations/blogsValidatio';
import {
    createBlog,
    updateBlogById,
    getBlogById,
    getAllBlogs,
    deleteBlogById,
    likeBlog,
    dislikeBlog,
    viewBlog,
   
} from '../controllers/blogsCtrl';
import { isLogin } from '../middlewares/isLogin';
import isAdmin from '../middlewares/isAdmin';

const router = express.Router();

// Set up Cloudinary storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a new blog with image upload to Cloudinary for imgsrc field
router.post('/', upload.single('file'),isLogin,isAdmin, async (req:any, res) => {
    try {
        // Validate request body
        const { error } = createBlogValidation.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 'error',
                message: error.details[0].message,
            });
        }

        // Continue with creating the blog
        await createBlog(req, res);
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
});

// Update a blog by ID
router.patch('/:id', upload.single('file'), isLogin, isAdmin, async (req: any, res) => {
    try {
        // Continue with updating the blog without validation
        await updateBlogById(req, res);
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
});

// Get a blog by ID
router.get('/:id', async (req, res) => {
    await getBlogById(req, res);
});

// Get all blogs
router.get('/', async (req, res) => {
    await getAllBlogs(req, res);
});

// Delete a blog by ID
router.delete('/:id',isLogin,isAdmin, async (req, res) => {
    await deleteBlogById(req, res);
});

// Like a blog
router.post('/:id/likes', async (req, res) => {
    await likeBlog(req, res);
});

// Dislike a blog
router.post('/:id/dislikes', async (req, res) => {
    await dislikeBlog(req, res);
});

// View a blog
router.post('/:id/views', async (req, res) => {
    await viewBlog(req, res);
});


export default router;
