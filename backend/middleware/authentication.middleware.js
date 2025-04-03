const jwt = require('jsonwebtoken');

const authenMiddleware = (req, res, next) => {
    const token = req.cookies.authToken;
    if(!token){
        res.status(401).json({message: "Unauthorized Access!"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        res.status(500).json({message: "Internal Server Error!"});
    }
} 

module.exports = authenMiddleware;