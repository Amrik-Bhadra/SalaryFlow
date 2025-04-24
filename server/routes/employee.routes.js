const express = require('express');
const router = express.Router();
const { getEmployeesController, deleteEmployeeController, getEmployeeData, updateEmployee, getProjects } = require('../controllers/employee.controller');

router.get('/getEmployees', getEmployeesController);
router.delete('/deleteEmployee', deleteEmployeeController);
router.get('/getData', getEmployeeData);
router.put('/updateEmployee', updateEmployee);
router.post('/getProjects', getProjects);
module.exports = router;