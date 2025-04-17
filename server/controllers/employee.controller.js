const User = require('../models/user.models.js');

const getEmployeesController = async (req, res) => {
    try {
        const employees = await User.find({ role: "employee" }).sort({ created_at: -1 });
        res.status(200).json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Failed to fetch employees" });
    }
};

const deleteEmployeeController = async (req, res) => {
    
    try {
        const { deleteEmployeeId } = req.body;
        console.log(deleteEmployeeId);
        const user = await User.findOne({ _id: deleteEmployeeId });
        if (!user) {
            return res.status(401).json({ message: 'User Not Found!' });
        }

        await User.deleteOne({ _id: deleteEmployeeId });
        res.status(200).json({ message: "User Deleted Successfully!" });
    }catch(error){
        res.status(501).json({message: "Internal Server Error"});
    }

}


module.exports = {
    getEmployeesController,
    deleteEmployeeController
}