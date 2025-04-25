const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // Hashed password
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "employee"],
        default: "employee"
    },
    // S3 or cloud storage URL
    profile_picture: {
        type: String
    },

    designation: {
        type: String
    },
    work_type: {
        type: String,
        enum: ["onsite", "office"],
    },
    address: {
        type: String
    },
    phone: {
        type: String,
        match: /^[0-9]{10}$/,
    },
    status: {
        type: String,
        enum: ["active", "blocked"],
        default: "active"
    },
    // Only for onsite employees
    assigned_project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    base_salary: {
        type: Number,
        required: true,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
