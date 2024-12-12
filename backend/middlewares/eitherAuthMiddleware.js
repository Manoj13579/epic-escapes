import { authenticateToken } from './authMiddleware.js';
import '.././controllers/googleAuthController.js';



const eitherAuthMiddleware = (req, res, next) => {
console.log("eitherAuthMiddleware hit");
console.log( "req.isAuthenticated",req.isAuthenticated());
// check for google login
  if (req.isAuthenticated()) {
    return next();
} 
  /* If accessToken is available, authenticate via authenticateToken middleware passing same parameters it needs for same functioning */
  return authenticateToken(req, res, next);
};

export default eitherAuthMiddleware;