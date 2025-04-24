const User = require('../models/user.models');
const Project = require('../models/project.models');
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


module.exports = {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
  updateEmployee
};
