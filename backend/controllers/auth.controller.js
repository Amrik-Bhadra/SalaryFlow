const User = require('../models/users.models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// login controller
const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        //check if user exists or not
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: "Invalid email or password"});
        }

        // user found but check if password entered is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            req.status(401).json({message: "Wrong Password!"});
        }


        // generate jwt token
        const token = jwt.sign(
            {id: user._id, role: user.role, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: "1hr"}
        );

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: false, // change it to true when in production with https
            sameSite: "lax",
            maxAge: 3600000, //1hr
        });

        res.status(200).json({message: "Login successful!", token, user});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal Server Error", error});
    }

}

// logout controller
const logout = (req, res) => {
    try{
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: false, // change it to true when in production with https
            sameSite: "lax",
        });

        res.status(200).json({message: "Logout successful!"});
    }catch(error){
        res.status(500).json({message: "Internal Server Error!", error});
    }
}

module.exports = { login, logout };