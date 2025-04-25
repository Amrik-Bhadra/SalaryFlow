import { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import generateStrongPassword from "../../services/generateStrongPassword";
import toast from "react-hot-toast";
import useAxios from "../../utils/validator/useAxios";

const AddNewEmployee = ({onClose, fetchEmployees }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "employee",
    base_salary: 0,
  });  
  const axiosInstance = useAxios();

  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword();
    setFormData({ ...formData, password: newPassword });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axiosInstance.post("/admin/auth/createEmployee", formData);
      if (response.status === 200) {
        toast.success("Employee added successfully!");
        fetchEmployees();
        onClose();
      } else {
        toast.error(response.data.message || "Failed to add employee");
      }
    } catch (err) {
      console.error("API Error:", err);
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] max-w-xl relative">
        <span className="flex gap-x-2 items-center mb-6">
          <div className="p-2 rounded-full bg-sky bg-opacity-[30%] border border-sky">
            <IoAddOutline className="text-sky text-2xl font-semibold" />
          </div>
          <h2 className="text-2xl font-medium text-left">
            New Employee Details
          </h2>
        </span>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md focus-within:border-sky"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Base Salary (per month)</label>
            <input
              type="number"
              name="base_salary"
              value={formData.base_salary}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md focus-within:border-sky"
            />
          </div>

          <div className="flex gap-x-2 w-full items-end">
            <div className="col-span-1 w-full">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-md focus-within:border-sky"
              />
            </div>

            <button
              type="button"
              onClick={handleGeneratePassword}
              className="h-[42px] px-4 bg-[#464646] text-white rounded-md hover:bg-[#222] transition"
            >
              Generate
            </button>
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
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewEmployee;
