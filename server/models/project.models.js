const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String
    },
    client_name:{
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["ongoing", "completed"],
        default: "ongoing"
    },
    assigned_employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    office_based: { 
        type: Boolean, 
        default: false 
    }, 
    start_date:{
        type: Date
    },
    end_date: { 
        type: Date 
    },
}, { timestamps: true });

const projectModel = mongoose.model('Project', projectSchema);

module.exports = projectModel;