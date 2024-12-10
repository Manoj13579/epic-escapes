import jwt from 'jsonwebtoken';


const authenticateToken = (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;
    
    
    if(!accessToken) {
        return res.status(404).json({ success: false, message: "accessToken not found"})
    };
    try {
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).json({ success: false, message: " authenticateToken unauthorized"})
        };
        req.decoded = decoded;
        next();
      })  
    } 
    catch (error) {
        console.log('authenticateToken', error); 
        return res.status(500).json({ success: false, error });
    }
};


const authorizeAdmin = (req, res, next) => {
    
        if(req.decoded.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access Denied"})
        } ;
        next();
   
};

const authorizeUser = (req, res, next) => {

    if(req.decoded.role !== "user") {
        return res.status(403).json({ success: false, message: "Access Denied"})
    };
    next();
    };



    export { authenticateToken, authorizeAdmin, authorizeUser};