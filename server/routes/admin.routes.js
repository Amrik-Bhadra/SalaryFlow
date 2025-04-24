const express = require('express');
const router = express.Router();
const { getProjects, createProject, deleteProject, updateProject, updateEmployee } = require('../controllers/admin.controller');

router.get('/getProjects', getProjects);
router.post('/createProject', createProject);
router.delete('/deleteProject', deleteProject);
router.put('/updateProject/:id', updateProject);
router.put('/updateEmployee/:id', updateEmployee);

module.exports = router;