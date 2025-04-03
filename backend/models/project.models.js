const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    project_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Ongoing", "Completed"],
        default: "Ongoing"
    },
    assigned_employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    // true if office-based
    office_based: { 
        type: Boolean, 
        default: false 
    }, 
    deadline: { 
        type: Date 
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

const projectModel = mongoose.model('Project', projectSchema);

module.exports = projectModel;