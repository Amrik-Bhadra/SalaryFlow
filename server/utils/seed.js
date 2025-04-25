require('dotenv').config(); 
const mongoose = require("mongoose");
// const connectDB = require("../config/db"); // ✅ Reuse your connection logic
const Attendance = require("../models/attendance.models"); // Adjust path as needed
const mongo_uri = `mongodb+srv://amrikbhadra:salaryflow123@salaryflowcluster.2vfx0tr.mongodb.net/salaryflowdb?retryWrites=true&w=majority&appName=salaryflowcluster`

const userId = "68027bdfcf84fdf16b401fe1";


function connectDB(){
    mongoose.connect(mongo_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>{
        console.log(`Connected to MongoDB ✅`);
    }).catch((err)=>{
        console.error(`Mongodb connection error: ${err}`);
    })
}

const getRandomStatus = () => {
  const statuses = ["present", "absent", "on-leave", "half-day"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const getRandomTime = () => {
  const hours = Math.floor(Math.random() * 2 + 9); // Between 9AM to 10:59AM
  const minutes = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

const getRandomHours = (status) => {
  if (status === "present") return Math.floor(Math.random() * 3 + 6);
  if (status === "half-day") return Math.floor(Math.random() * 2 + 3);
  return 0;
};

const generateData = () => {
  const data = [];
  const startDate = new Date("2025-01-01");
  const endDate = new Date("2025-04-23");

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 0) continue;

    const status = getRandomStatus();
    const checkIn = status === "present" || status === "half-day" ? getRandomTime() : null;
    const checkOut = checkIn
      ? `${parseInt(checkIn.split(":")[0]) + getRandomHours(status)}:${checkIn.split(":")[1]}`
      : null;

    data.push({
      employee_id: userId,
      date: new Date(d),
      status,
      check_in_time: checkIn,
      check_out_time: checkOut,
      totalHours: getRandomHours(status),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  return data;
};

const seedData = async () => {
  await connectDB(); // ✅ Using your existing DB connection
  const dummyData = generateData();

  try {
    await Attendance.insertMany(dummyData);
    console.log(`✅ Inserted ${dummyData.length} attendance records.`);
  } catch (error) {
    console.error("❌ Failed to insert data:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
