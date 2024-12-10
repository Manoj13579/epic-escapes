import express from 'express';
import { googleAuth, googleAuthCallback, googleLogout, userInfo } from '../controllers/googleAuthController.js';



const googleAuthRoutes = express.Router();


googleAuthRoutes.get('/auth/google', googleAuth);
googleAuthRoutes.get('/auth/google/callback', googleAuthCallback);
googleAuthRoutes.get('/login/success', userInfo,);
googleAuthRoutes.post('/googlelogout', googleLogout,);


export default googleAuthRoutes;