import express from 'express'
import authRoutes from './authRoutes.js';
import googleAuthRoutes from './googleAuthRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import productsRoutes from './productsRoutes.js';
import bookingRoutes from './bookingRoutes.js';


const indexRouter = express.Router();

indexRouter.use('/api/auth', authRoutes);
indexRouter.use('/api', googleAuthRoutes);
indexRouter.use('/api/upload', uploadRoutes);
indexRouter.use('/api/products', productsRoutes);
indexRouter.use('/api/booking', bookingRoutes);


export default indexRouter;