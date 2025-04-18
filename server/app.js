require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieparser = require('cookie-parser');
const connectDB = require('./config/db');
const authenRoutes = require('./routes/authentication.routes');
const employeeRoutes = require('./routes/employee.routes');
const projectRoutes = require('./routes/projectRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const reportRoutes = require('./routes/reportRoutes');

var corsOption = {
    origin: ['http://localhost:5173'],
    methods: 'GET,PATCH,PUT,POST,HEAD,DELETE',
    credentials: true,
    AccessControlAllowOrigin: true,
    optionsSuccessStatus: 200
}

var port = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOption));
app.use(cookieparser());

// connect to mongodb database
connectDB();

// routes
app.use('/api/auth', authenRoutes);
app.use('/admin/auth', authenRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/reports', reportRoutes);

//listen to server
app.listen(port, ()=>{
    console.log(`App is listening to the port ${port} ✅`);
});


