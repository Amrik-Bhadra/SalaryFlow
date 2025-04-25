const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        index: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["present", "absent", "on-leave", "half-day"], 
        default: "absent" 
    },
    check_in_time: { 
        type: String 
    },
    check_out_time: { 
        type: String 
    },
    totalHours: {
        type: Number,
        default: 0,
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

attendanceSchema.index({ employee_id: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ status: 1 });

const attendanceModel = mongoose.model('Attendance', attendanceSchema);

module.exports = attendanceModel;

// module.exports = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

