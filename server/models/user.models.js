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
    // Face recognition data
    face_embedding: {
        type: [Number]
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
        required: true,
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
