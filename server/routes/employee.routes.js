const express = require('express');
const router = express.Router();
const { getEmployeesController, deleteEmployeeController } = require('../controllers/employee.controller');

router.get('/getEmployees', getEmployeesController);
router.delete('/deleteEmployee', deleteEmployeeController);
module.exports = router;