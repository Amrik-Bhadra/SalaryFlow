const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Present", "Absent", "On Leave"], default: "Present" },
    check_in_time: { type: Date },
    check_out_time: { type: Date },
    gps_location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    verified_location: {
        matched: { type: Boolean, required: true },
        location_type: { type: String, enum: ["project", "office"], required: true },
        matched_with: { type: mongoose.Schema.Types.ObjectId, refPath: "verified_location.location_type" } // Reference to project or office
    },
    photo_verified: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
