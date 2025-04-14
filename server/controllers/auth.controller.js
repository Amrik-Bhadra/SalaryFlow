const User = require('../models/user.models.js');
const Otp = require('../models/otp.models.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/emailService.js');
const { otpEmailTemplate, credentialsEmailTemplate } = require('../utils/emailTemplates.js');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// create new employee controller
const createUserController = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const normalisedEmail = email.toLowerCase();
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'Email Already Exists!' });
        }

        const newUser = new User({
            email: normalisedEmail,
            password,
            role
        });

        await newUser.save();

        await sendEmail(normalisedEmail, 'Login Credentials', credentialsEmailTemplate(normalisedEmail, password));

        // Just return success message
        res.status(200).json({ message: 'User Created Successfully!' });
    }catch(error){
        res.status(500).json({ message: 'Error while Creating User' });
    }
}

// login controller
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email enetered is invalid!' });
        }

        const isPasswordMatched = bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(401).json({ message: 'Wrong Password!' });
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        // Delete previous OTPs (optional but recommended)
        await Otp.deleteMany({ email });

        await sendEmail(email, "Your Login OTP", otpEmailTemplate(otp));
        // Store OTP in DB
        await Otp.create({ email, code: otp, expiresAt });

        res.cookie("pendingUser", email, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 5 * 60 * 1000 // 5 minutes
        });

        return res.status(200).json({ message: "OTP sent to your email. Please verify to complete login." });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

// verify otp controller
const verifyOtpController = async (req, res) => {
    try {
        const { otp } = req.body;
        const email = req.cookies.pendingUser;

        if (!email) {
            return res.status(400).json({ message: "Session expired. Please login again." });
        }

        const record = await Otp.findOne({ email });
        if (!record) {
            return res.status(400).json({ message: "No OTP found. Please login again." });
        }

        if (record.code !== otp) {
            return res.status(401).json({ message: "Invalid OTP." });
        }

        if (new Date() > record.expiresAt) {
            await Otp.deleteOne({ _id: record._id }); // clean expired OTP
            return res.status(400).json({ message: "OTP expired. Please login again." });
        }

        // OTP valid — delete it
        await Otp.deleteOne({ _id: record._id });
        res.clearCookie("pendingUser");

        const user = await User.findOne({ email });
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };
        const secret = process.env.JWT_SECRET;

        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000
        });

        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                _id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// changePassword controller
const changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const decoded = jwt.verify(req.cookies.authToken, process.env.JWT_SECRET);
        const email = decoded.email;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User Not Found!' });
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(409).json({ message: 'Password must be different!' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT));
        user.password = hashedPassword;
        user.updated_at = new Date();

        await user.save();

        res.status(200).json({ message: "Password Updated Successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error in Updating Password" });
    }
};


// complete profile details controller
const completeProfile = async (req, res) => {
    try {
        const { name, designation, work_type } = req.body;

        const decoded = jwt.verify(req.cookies.authToken, process.env.JWT_SECRET);
        const email = decoded.email;

        const user = await User.findOne({ email }); // ✅ CORRECT

        if (!user) {
            return res.status(401).json({ message: 'User Not Found!' });
        }

        user.name = name;
        user.designation = designation;
        user.work_type = work_type;
        user.updated_at = new Date();

        await user.save();

        res.status(200).json({ message: 'Profile Completed Successfully!' });
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).json({ message: 'Internal Error' });
    }
};


// logout controller
const logoutController = (req, res) => {
    try {
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
        });

        res.status(200).json({ message: "Logout successful!" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!", error });
    }
}

module.exports = {
    loginController,
    logoutController,
    verifyOtpController,
    createUserController,
    completeProfile,
    changePassword
};