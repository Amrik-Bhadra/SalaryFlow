import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import useAxios from "../../utils/validator/useAxios";
import toast from "react-hot-toast";

const EditEmployeeDetails = ({ employee, onClose, fetchEmployees }) => {
  const [formData, setFormData] = useState({
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    address: employee.address,
    designation: employee.designation,
    work_type: employee.work_type,
    status: employee.status
  });
  const axiosInstance = useAxios();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log( `Employeid: ${employee._id}`);
    try{
      const response = await axiosInstance.put(`/admin/updateEmployee/${employee._id}`, {...formData});

      if(response.status == 200){
        toast.success(response.data.message || "Employee Data Updated Successfully!");
        fetchEmployees();
        onClose();
      }else{
        toast.error(response.data.message || "Failed to Update Employee data");
      }
    }catch(error){
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] max-w-xl relative">
        <span className="flex gap-x-2 items-center mb-6">
          <div className="p-2 rounded-full bg-sky bg-opacity-[30%] border border-sky">
            <CiEdit className="text-sky text-2xl font-semibold"/>
          </div>
          <h2 className="text-2xl font-medium text-left">
            Edit Employee
          </h2>
        </span>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">
              Employee Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">
              Designation
            </label>
            <input
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Phone No</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Work Type</label>
            <select
              name="work_type"
              value={formData.work_type}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="available">Onsite</option>
              <option value="out of stock">Office</option>
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="available">Active</option>
              <option value="out of stock">Block</option>
            </select>
          </div>

          <div className="col-span-2 flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#f1f1f1] shadow-sm rounded-md"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeDetails;
