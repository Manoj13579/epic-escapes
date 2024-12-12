import express from 'express';
import { createBooking, deletebooking, getAllBookings, getUserBooking } from '../controllers/bookingController.js';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware.js';
import eitherAuthMiddleware from '../middlewares/eitherAuthMiddleware.js';





const bookingRoutes = express.Router();


bookingRoutes.get('/get-user-booking', eitherAuthMiddleware, getUserBooking);
bookingRoutes.post('/create-booking', eitherAuthMiddleware, createBooking);
bookingRoutes.delete('/delete-booking', authenticateToken, authorizeAdmin, deletebooking);
bookingRoutes.get('/get-all-bookings', authenticateToken, authorizeAdmin, getAllBookings);




export default bookingRoutes;