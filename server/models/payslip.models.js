const mongoose = require('mongoose');

const payslipSchema = new mongoose.Schema({
    employee_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        index: true 
    },
    payment_date: {
        type: Date,
        required: true,
    },
    basic_salary: {
        type: Number,
        required: true,

    },
    hra: {
        type: Number,
        required: true,
    },
    transport: {
        type: Number,
        required: true,
    },
    medical: {
        type: Number,
        required: true,
    },
    tax:{
        type: Number,
        required: true,
    },
    pf:{
        type: Number,
        required: true,
    },
    insurance: {
        type: Number,
        required: true,
    },
    net_salary: {
        type: Number,
        required: true,
    },
    total_working_hours: {
        type: Number,
        required: true,
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const payslipModel = mongoose.model("PaySlip", payslipSchema);

module.exports = payslipModel;
