import express from 'express';
import { addProduct, deleteProduct, getProducts, updateProduct } from '../controllers/productController.js';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware.js';




const productsRoutes = express.Router();


productsRoutes.get('/get-products', getProducts);
productsRoutes.post('/add-product', authenticateToken, authorizeAdmin, addProduct);
productsRoutes.post('/update-product', authenticateToken, authorizeAdmin, updateProduct);
productsRoutes.delete('/delete-product', authenticateToken, authorizeAdmin, deleteProduct);



export default productsRoutes;