const express = require('express');
const router = express.Router();
const { getProjects, createProject, deleteProject, updateProject, updateEmployee, generatePayslip, getPaySlips, generatePaySlipReport,getPaySlipReportsByYear, deletePaySlip, deletePaySlipReport } = require('../controllers/admin.controller');

router.get('/getProjects', getProjects);
router.post('/createProject', createProject);
router.delete('/deleteProject', deleteProject);
router.put('/updateProject/:id', updateProject);
router.put('/updateEmployee/:id', updateEmployee);
router.post('/generatePayslips', generatePayslip);
router.get('/getPaySlips', getPaySlips);
router.post('/generatePayslipReport', generatePaySlipReport);
router.get('/getPaySlipReportsByYear', getPaySlipReportsByYear);
router.delete('/deletePayslip/:id', deletePaySlip);
router.delete('/deletePayslipReport/:id', deletePaySlipReport);
module.exports = router;