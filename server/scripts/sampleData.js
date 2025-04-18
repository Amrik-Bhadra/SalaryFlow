require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const Project = require('../models/Project');
const Attendance = require('../models/Attendance');
const bcrypt = require('bcryptjs');

const connectDB = require('../config/db');

const generateRandomTime = (baseHour, variance) => {
  const minutes = Math.floor(Math.random() * 60);
  const hourVariance = Math.floor(Math.random() * variance);
  const hour = baseHour + hourVariance;
  return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const clearCollections = async () => {
  await Employee.deleteMany({});
  await Project.deleteMany({});
  await Attendance.deleteMany({});
  console.log('Existing data cleared');
};

const createSampleEmployees = async () => {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const employees = [
    {
      name: 'John Smith',
      email: 'john.smith@company.com',
      password: hashedPassword,
      department: 'Engineering',
      position: 'Senior Developer',
      salary: 95000
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      password: hashedPassword,
      department: 'Design',
      position: 'UI/UX Designer',
      salary: 85000
    },
    {
      name: 'Michael Chen',
      email: 'michael.c@company.com',
      password: hashedPassword,
      department: 'Engineering',
      position: 'Full Stack Developer',
      salary: 90000
    },
    {
      name: 'Emily Brown',
      email: 'emily.b@company.com',
      password: hashedPassword,
      department: 'Project Management',
      position: 'Project Manager',
      salary: 92000
    },
    {
      name: 'David Wilson',
      email: 'david.w@company.com',
      password: hashedPassword,
      department: 'Engineering',
      position: 'Backend Developer',
      salary: 88000
    }
  ];

  const createdEmployees = await Employee.insertMany(employees);
  console.log('Sample employees created');
  return createdEmployees;
};

const createSampleProjects = async (employees) => {
  const projects = [
    {
      name: 'E-commerce Platform Redesign',
      description: 'Modernizing the company\'s e-commerce platform with new features and improved UI',
      status: 'ongoing',
      startDate: new Date('2024-01-15'),
      deadline: new Date('2024-06-30'),
      team: employees.slice(0, 3).map(emp => emp._id)
    },
    {
      name: 'Mobile App Development',
      description: 'Creating a new mobile application for customer engagement',
      status: 'ongoing',
      startDate: new Date('2024-02-01'),
      deadline: new Date('2024-08-15'),
      team: employees.slice(1, 4).map(emp => emp._id)
    },
    {
      name: 'Database Migration',
      description: 'Migrating legacy database to new cloud infrastructure',
      status: 'completed',
      startDate: new Date('2024-01-01'),
      deadline: new Date('2024-03-31'),
      team: [employees[0]._id, employees[4]._id]
    },
    {
      name: 'Security Audit Implementation',
      description: 'Implementing security measures based on recent audit',
      status: 'on-hold',
      startDate: new Date('2024-03-01'),
      deadline: new Date('2024-05-31'),
      team: employees.slice(2, 5).map(emp => emp._id)
    },
    {
      name: 'Analytics Dashboard',
      description: 'Building a real-time analytics dashboard for business metrics',
      status: 'ongoing',
      startDate: new Date('2024-02-15'),
      deadline: new Date('2024-07-31'),
      team: employees.map(emp => emp._id)
    }
  ];

  await Project.insertMany(projects);
  console.log('Sample projects created');
};

const createSampleAttendance = async (employees) => {
  const startDate = new Date('2024-01-01');
  const endDate = new Date();
  const attendanceRecords = [];

  for (const employee of employees) {
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const random = Math.random();
      let status;
      if (random < 0.8) status = 'Present';
      else if (random < 0.95) status = 'Late';
      else status = 'Absent';

      const checkInTime = status === 'Present' ? 
        generateRandomTime(8, 2) : 
        status === 'Late' ? 
          generateRandomTime(10, 2) : 
          null;

      const checkOutTime = status !== 'Absent' ? 
        generateRandomTime(17, 2) : 
        null;

      attendanceRecords.push({
        employee: employee._id,
        date: new Date(date),
        status,
        checkInTime,
        checkOutTime
      });
    }
  }

  await Attendance.insertMany(attendanceRecords);
  console.log('Sample attendance records created');
};

const populateDatabase = async () => {
  try {
    await clearCollections();
    const employees = await createSampleEmployees();
    await createSampleProjects(employees);
    await createSampleAttendance(employees);
    console.log('Database populated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
};

populateDatabase(); 