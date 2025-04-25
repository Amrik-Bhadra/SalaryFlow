const User = require('../models/user.models.js');
const Project = require('../models/project.models.js');
const Attendance = require('../models/attendance.models.js');
const Payslip = require('../models/payslip.models.js');

const getEmployeesController = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).sort({ created_at: -1 });
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

const getEmployeeData = async (req, res) => {
  try {
    const { email } = req.query;
    console.log('employee email: ', email);
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }


    res.status(200).json({ message: "Data Found", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch employee data" });
  }
}

const deleteEmployeeController = async (req, res) => {

  try {
    const { deleteEmployeeId } = req.body;
    console.log(deleteEmployeeId);
    const user = await User.findOne({ _id: deleteEmployeeId });
    if (!user) {
      return res.status(401).json({ message: 'User Not Found!' });
    }

    await User.deleteOne({ _id: deleteEmployeeId });
    res.status(200).json({ message: "User Deleted Successfully!" });
  } catch (error) {
    res.status(501).json({ message: "Internal Server Error" });
  }

};


const updateEmployee = async (req, res) => {
  try {
    const { email, name, phone, address, designation, work_type } = req.body;
    console.log('email in backend: ', email);

    if (!email) {
      return res.status(400).json({ message: 'Email is required for update.' });
    }

    const updatedEmployee = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name,
          phone,
          address,
          designation,
          work_type,
        },
      },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    return res.status(200).json({
      message: 'Profile updated successfully.',
      data: updatedEmployee,
    });

  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const getProjects = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found!' });
    }

    const userId = user._id;
    const projects = await Project.find({ assigned_employees: userId });

    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date is required in query param" });
    }

    // Convert "2025-3-12" to start and end of that day
    const inputDate = new Date(date);
    const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999));

    const records = await Attendance.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    res.status(200).json(records);
  } catch (err) {
    console.error("Error fetching attendance by date:", err);
    res.status(500).json({ error: "Server error while fetching attendance" });
  }
};

const getPayslipsData = async(req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const payslips = await Payslip.find({ employee_id: user._id }).sort({ created_at: -1 });
    if (!payslips || payslips.length === 0) {
      res.status(400).json({ message: "No payslips found" });
      return;
    }

    console.log('payslips: ', payslips);
    res.status(200).json({ message: "Data Found", data: payslips });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch employee data" });
  }
}

module.exports = {
  getEmployeesController,
  deleteEmployeeController,
  getEmployeeData,
  updateEmployee,
  getProjects,
  getAttendanceByDate,
  getPayslipsData,
}