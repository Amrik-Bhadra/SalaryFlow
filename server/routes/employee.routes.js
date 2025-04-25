const express = require('express');
const router = express.Router();
const { getEmployeesController, deleteEmployeeController, getEmployeeData, updateEmployee, getProjects, getAttendanceByDate, getPayslipsData } = require('../controllers/employee.controller');

router.get('/getEmployees', getEmployeesController);
router.delete('/deleteEmployee', deleteEmployeeController);
router.get('/getData', getEmployeeData);
router.put('/updateEmployee', updateEmployee);
router.post('/getProjects', getProjects);
router.get('/getAttendanceByDate', getAttendanceByDate);
router.post('/getPayslipsData', getPayslipsData);
module.exports = router;