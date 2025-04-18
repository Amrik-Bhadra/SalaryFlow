const Project = require('../models/Project');

// Get all projects with statistics
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('teamMembers', 'name')
      .populate('createdBy', 'name');

    // Calculate statistics
    const stats = {
      total: projects.length,
      inProgress: projects.filter(p => p.status === 'In Progress').length,
      completed: projects.filter(p => p.status === 'Completed').length,
      onHold: projects.filter(p => p.status === 'On Hold').length
    };

    res.status(200).json({
      success: true,
      projects,
      stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching projects', 
      error: error.message 
    });
  }
};

// Create new project
const createProject = async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      createdBy: req.user._id
    });
    await project.save();
    
    const populatedProject = await Project.findById(project._id)
      .populate('teamMembers', 'name')
      .populate('createdBy', 'name');

    res.status(201).json({ 
      success: true,
      message: 'Project created successfully', 
      project: populatedProject 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error creating project', 
      error: error.message 
    });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    ).populate('teamMembers', 'name')
     .populate('createdBy', 'name');

    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: 'Project not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Project updated successfully', 
      project 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error updating project', 
      error: error.message 
    });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: 'Project not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Project deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting project', 
      error: error.message 
    });
  }
};

// Get project details
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate('teamMembers', 'name')
      .populate('createdBy', 'name');

    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: 'Project not found' 
      });
    }

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching project', 
      error: error.message 
    });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById
}; 