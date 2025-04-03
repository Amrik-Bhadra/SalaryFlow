const roleAclMiddleware = (roles)=>{
    return (req, res, next) => {
        if(!req.session.user){
            return res.status(401).json({ message: "Unauthorized. Please log in!" });
        }

        if(!roles.includes(req.session.user.role)){
            return res.status(403).json({message: "Forbidden. You do not have access."});
        }

        next();
    }
}

module.exports = roleAclMiddleware;