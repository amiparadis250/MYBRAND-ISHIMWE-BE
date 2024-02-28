import express from 'express';
import userRoutes from './routes//userRoutes';  
import blogRoutes from './routes/blogRoutes'; 
import commentRoutes from './routes/commentRoutes';
import querriesRoutes from './routes/queriesRoutes';
import documentation from './swagger.json';
import cors from'cors';

import swaggerjsdoc from 'swagger-jsdoc'
import swaggerUi from  "swagger-ui-express";
const app = express();
app.use(cors());
app.use(express.json());


import cloudinaryConfig from './Config/cloudinary'; 
import multer from 'multer';
import storage from './Config/cloudinary';


// Use the multer middleware for file uploads
const upload = multer({ storage });
// app.use(isAdmin);
// app.use(isAdmin);

// Use routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(documentation));
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes); 
app.use('/api/blogs', commentRoutes); 
app.use('/api/queries', querriesRoutes)


export default app