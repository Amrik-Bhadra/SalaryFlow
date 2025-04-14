const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authToken = req.cookies.authToken;

    if(!authToken){
        return res.status(400).json({message: "No token Provided"});
    }

    try{
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        req.user = decoded; // Add user data to request object
        next();
    }catch(error){
        console.log(error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = verifyToken;