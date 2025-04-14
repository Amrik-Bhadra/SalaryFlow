require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieparser = require('cookie-parser');
const connectDB = require('./config/db');
const authenRoutes = require('./routes/authentication.routes');

var corsOption = {
    credentials: true,
    AccessControlAllowOrigin: true,
    origin: ['http://localhost/5173'],
    methods: 'GET,PATCH,PUT,POST,HEAD,DELETE',
    optionsSuccessStatus: 200
}

// var sessionOptions = {
//     secret: '&&#(@@^%$)',
//     resave: false,
//     saveUninitialized: false,
//     cookie:{
//         secure: false,
//         maxAge: 600000,
//         httpOnly: true,
//         sameSite: 'lax'
//     },
//     unset: 'destroy',
//     name: 'sessionId',
//     exposeHeaders: ['Set-Cookie']
// };

var port = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOption));
app.options('*', cors());
app.use(cookieparser());

// connect to mongodb database
connectDB();

// routes
app.use('/api/auth', authenRoutes);
app.use('/admin/auth', authenRoutes);


//listen to server
app.listen(port, ()=>{
    console.log(`App is listening to the port ${port} ✅`);
});


