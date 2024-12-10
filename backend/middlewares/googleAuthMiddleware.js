export const googleAuthMiddleware = (req, res, next) => {
    console.log("googleauthmiddleware hit");
    
    if (req.isAuthenticated() && req.user) {
        return next();
    } else {
        return next();
    }
};