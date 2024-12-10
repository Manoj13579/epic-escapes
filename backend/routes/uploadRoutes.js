import express from 'express';
import { upload, uploadImage } from '../middlewares/multerCloudinary.js';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware.js';



const uploadRoutes = express.Router();


uploadRoutes.post('/admin-image-upload', authenticateToken, authorizeAdmin, upload.single('image'), uploadImage);
uploadRoutes.post('/register-image-upload', upload.single('image'), uploadImage);
uploadRoutes.post('/user-image-upload', authenticateToken, upload.single('image'), uploadImage);



export default uploadRoutes;