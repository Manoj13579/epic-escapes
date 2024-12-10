import { authenticateToken } from './authMiddleware.js';
import { googleAuthMiddleware } from './googleAuthMiddleware.js';


const eitherAuthMiddleware = (req, res, next) => {
  
  googleAuthMiddleware(req, res, (err) => {
    if (!err) {
      return next();
    }
    authenticateToken(req, res, (err) => {
      if (!err) {
        return next();
      }
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    });
  });
};

export default eitherAuthMiddleware;