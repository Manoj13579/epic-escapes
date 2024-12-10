import express from 'express';
import { createBooking, deletebooking, getAllBookings, getUserBooking } from '../controllers/bookingController.js';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware.js';





const bookingRoutes = express.Router();


bookingRoutes.get('/get-user-booking', authenticateToken, getUserBooking);
bookingRoutes.post('/create-booking', authenticateToken, createBooking);
bookingRoutes.delete('/delete-booking', authenticateToken, authorizeAdmin, deletebooking);
bookingRoutes.get('/get-all-bookings', authenticateToken, authorizeAdmin, getAllBookings);




export default bookingRoutes;