import express from 'express';
import userRoutes from './routes//userRoutes';  
import blogRoutes from './routes/blogRoutes'; 
import commentRoutes from './routes/commentRoutes';
import querriesRoutes from './routes/queriesRoutes';
const app = express();
app.use(express.json());


import cloudinaryConfig from './Config/cloudinary'; 
import multer from 'multer';
import storage from './Config/cloudinary';


// Use the multer middleware for file uploads
const upload = multer({ storage });
// app.use(isAdmin);
// app.use(isAdmin);

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes); 
app.use('/api/blogs', commentRoutes); 
app.use('/api/queries', querriesRoutes)

// Error handling
export default app