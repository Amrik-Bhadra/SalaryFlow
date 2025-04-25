const User = require('../models/user.models');
const Project = require('../models/project.models');
const Attendance = require('../models/attendance.models');
const PaySlip = require('../models/payslip.models');
const PaySlipReport = require('../models/payslipreport.model');
const sendEmail = require('../utils/emailService');
const { addedToProjectTemplate } = require('../utils/emailTemplates');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('assigned_employees');
    if (!projects || projects.length === 0) {
      return res.status(400).json({ message: 'No projects found' });
    }


    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error while fetching projects' });
  }
};

const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      client_name,
      status,
      employees,
      latitude,
      longitude,
      project_type,
      start_date,
      end_date,
    } = req.body;

    // Fetch emails of assigned employees
    const fetched_employees = await User.find({ email: { $in: employees } });
    const assigned_employees = fetched_employees.map(user => user._id);

    // Create a new project
    const project = new Project({
      title,
      description,
      client_name,
      status,
      assigned_employees,
      location: { latitude, longitude },
      office_based: project_type,
      start_date,
      end_date
    });

    await project.save();

    // Send email to each
    for (const emp of fetched_employees) {
      await sendEmail(emp.email, "Project Assigned!", addedToProjectTemplate(emp.name, title));
    }

    return res.status(200).json({ message: 'Project created and emails sent successfully.', project });

  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Something went wrong.", error });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { deleteProject } = req.body;
    const id = deleteProject;

    const project = await Project.findOne({ _id: id });
    if (!project) {
      return res.status(400).json({ message: "Project not found!" });
    }

    await Project.deleteOne({ _id: id });
    res.status(200).json({ message: "Project Deleted Successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const updateProject = async (req, res) => {
  try {
    const {
      title,
      description,
      client_name,
      status,
      employees,
      latitude,
      longitude,
      project_type,
      start_date,
      end_date,
    } = req.body;

    const { id } = req.params;

    const office_based = project_type === "true" || project_type === "Office";

    // Fetch emails of assigned employees
    const fetched_employees = await User.find({ email: { $in: employees } });
    const assigned_employees = fetched_employees.map(user => user._id);

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title,
        description,
        client_name,
        status,
        assigned_employees,
        location: { latitude, longitude },
        office_based,
        start_date,
        end_date
      },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found." });
    }

    return res.status(200).json({
      message: "Project updated successfully.",
      project: updatedProject
    });

  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Something went wrong while updating the project.", error });
  }
}


const updateEmployee = async (req, res) => {
  try {
    const { name, email, designation, work_type, status, phone, address } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User Not Found!" });
    }

    user.name = name;
    user.email = email;
    user.designation = designation;
    user.work_type = work_type;
    user.status = status;
    user.phone = phone;
    user.address = address;

    await user.save();

    res.status(200).json({ message: "Employee Data Updated Successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};



const generatePayslip = async (req, res) => {
  try {
    const { month, year, email } = req.body;

    const payslips = [];

    for (const userEmail of email) {
      const employee = await User.findOne({ email: userEmail });
      if (!employee) continue;

      const employee_id = employee._id;
      const baseSalary = employee.base_salary;

      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);
      const totalDaysInMonth = endOfMonth.getDate();

      const attendanceRecords = await Attendance.find({
        employee_id,
        date: { $gte: startOfMonth, $lte: endOfMonth }
      });

      const presentDays = attendanceRecords.filter(a => a.status === 'present' || a.status === 'half-day').length;
      const halfDays = attendanceRecords.filter(a => a.status === 'half-day').length;

      const effectivePresentDays = presentDays + (halfDays * 0.5);
      const perDaySalary = baseSalary / totalDaysInMonth;
      const effectiveBasicSalary = perDaySalary * effectivePresentDays;

      const hra = effectiveBasicSalary * 0.20;
      const transport = effectiveBasicSalary * 0.10;
      const medical = effectiveBasicSalary * 0.10;
      const tax = effectiveBasicSalary * 0.10;
      const pf = effectiveBasicSalary * 0.12;
      const insurance = effectiveBasicSalary * 0.05;

      const netSalary = effectiveBasicSalary + hra + transport + medical - tax - pf - insurance;

      const totalWorkingHours = attendanceRecords.reduce((sum, record) => sum + (record.totalHours || 0), 0);

      const newPayslip = new PaySlip({
        employee_id,
        payment_date: new Date(),
        basic_salary: effectiveBasicSalary.toFixed(2),
        hra: hra.toFixed(2),
        transport: transport.toFixed(2),
        medical: medical.toFixed(2),
        tax: tax.toFixed(2),
        pf: pf.toFixed(2),
        insurance: insurance.toFixed(2),
        net_salary: netSalary.toFixed(2),
        total_working_hours: totalWorkingHours
      });

      await newPayslip.save();
      payslips.push(newPayslip);
    }

    res.status(200).json({ message: 'Payslips generated successfully', payslips });
  } catch (error) {
    console.error("Payslip generation error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


const getPaySlips = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (isNaN(monthNum) || isNaN(yearNum)) {
      return res.status(400).json({ message: "Invalid month or year format" });
    }

    // Define the start and end dates for the specified month
    const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0, 0)); 
    const endDate = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999));

  
    const payslips = await PaySlip.find({
      payment_date: {
        $gte: startDate,
        $lt: endDate
      }
    })
      .populate({
        path: "employee_id",
        select: "name designation"
      })
      .sort({ payment_date: -1 });

    res.status(200).json(payslips);
  } catch (error) {
    console.error("Error fetching payslips:", error);
    res.status(500).json({ message: "Server error while fetching payslips" });
  }
};


const generatePaySlipReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (isNaN(monthNum) || isNaN(yearNum)) {
      return res.status(400).json({ message: "Invalid month or year format" });
    }

    const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0, 0)); 
    const endDate = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999));

    // Fetch all active employees
    const allEmployees = await User.find({ status: "active", role: "employee" });

    // Fetch payslips in the selected month
    const payslips = await PaySlip.find({
      payment_date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("employee_id", "name");

    const payedEmployeesMap = new Map();
    const payed_employees = [];

    // Build a map of employee_id => payslip
    for (const slip of payslips) {
      if (slip.employee_id?._id) {
        payedEmployeesMap.set(String(slip.employee_id._id), slip);
        payed_employees.push({
          employee_id: slip.employee_id._id,
          name: slip.employee_id.name,
          payslip_data: slip,
        });
      }
    }

    // Find employees who were NOT paid
    const not_payed_employees = allEmployees
      .filter(emp => !payedEmployeesMap.has(String(emp._id)))
      .map(emp => ({
        employee_id: emp._id,
        name: emp.name,
      }));

    // Create a new payslip report document
    const report = await PaySlipReport.create({
      report_date: new Date(),
      report_title: `PaySlip Report - ${startDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      })}`,
      not_payed_employees,
      payed_employees,
    });

    return res.status(200).json({
      message: "Payslip report generated successfully",
      report,
    });
  } catch (err) {
    console.error("Error generating payslip report:", err);
    return res.status(500).json({ message: "Server error while generating report" });
  }
};


const getPaySlipReportsByYear = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year || isNaN(parseInt(year))) {
      return res.status(400).json({ message: "Valid year is required" });
    }

    const yearNum = parseInt(year);
    
    // Define start and end dates for the given year
    const startDate = new Date(yearNum, 0, 1);     // Jan 1st
    const endDate = new Date(yearNum + 1, 0, 1);   // Jan 1st of next year

    const reports = await PaySlipReport.find({
      report_date: {
        $gte: startDate,
        $lt: endDate
      }
    }).sort({ report_date: -1 }); // optional sorting by latest first

    return res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching payslip reports:", error);
    return res.status(500).json({ message: "Server error while fetching reports" });
  }
};

const deletePaySlip = async (req, res) => {
  try {
    const { id } = req.params;

    const payslip = await PaySlip.findById(id);
    if (!payslip) {
      return res.status(404).json({ message: "Payslip not found" });
    }

    await PaySlip.deleteOne({ _id: id });
    res.status(200).json({ message: "Payslip deleted successfully" });
  } catch (error) {
    console.error("Error deleting payslip:", error);
    res.status(500).json({ message: "Server error while deleting payslip" });
  }
};

const deletePaySlipReport = async (req, res) => {
  try {
    const { id } = req.params;

    const payslipreport = await PaySlipReport.findById(id);
    if (!payslipreport) {
      return res.status(404).json({ message: "Payslip Report not found" });
    }

    await PaySlipReport.deleteOne({ _id: id });
    res.status(200).json({ message: "Payslip Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting payslip:", error);
    res.status(500).json({ message: "Server error while deleting payslip" });
  }
};

module.exports = {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
  updateEmployee,
  generatePayslip,
  getPaySlips,
  generatePaySlipReport,
  getPaySlipReportsByYear,
  deletePaySlip,
  deletePaySlipReport
};
