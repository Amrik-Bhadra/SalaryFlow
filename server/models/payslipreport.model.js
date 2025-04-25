const mongoose = require('mongoose');

const payslipReportSchema = new mongoose.Schema({
  report_date: {
    type: Date,
    required: true,
  },
  report_title: {
    type: String,
    required: true,
  },
  not_payed_employees: [
    {
      employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      }
    }
  ],
  payed_employees: [
    {
      employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      payslip_data: {
        type: Object,
        required: true
      }
    }
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const payslipReportModel = mongoose.model("PaySlipReport", payslipReportSchema);

module.exports = payslipReportModel;
