// uploadMiddleware.js

import multer from 'multer';

const storage = multer.memoryStorage(); // Choose your storage strategy

const upload = multer({ storage });

export const uploadImageMiddleware = upload.single('file');
