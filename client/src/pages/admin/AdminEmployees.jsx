import { useEffect, useState } from "react";
import { IoSearch, IoAdd } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin7Line } from "react-icons/ri";
import { FaRegStar } from "react-icons/fa";
import AddNewEmployee from "../../components/admin_employee_page/AddNewEmployee";
import EditEmployeeDetails from "../../components/admin_employee_page/EditEmployeeDetails";
import DeleteEmployeeModal from "../../components/admin_employee_page/DeleteEmployeeModal";
import useAxios from "../../utils/validator/useAxios";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const getStatusColor = (status) => {
  return status === "active"
    ? "bg-success-op text-success border border-success"
    : "bg-danger-op text-danger border border-danger";
};

const AdminEmployees = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editEmployee, setEditEmployee] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const axiosInstance = useAxios();

  const totalPages = Math.ceil(employees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedEmployees = employees.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get("/api/employee/getEmployees");        
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    console.log(deleteEmployeeId);
    try {
      const response = await axiosInstance.delete('/api/employee/deleteEmployee', 
        {data: { deleteEmployeeId }});
  
      if (response.status === 200) {
        toast.success(response.data.message);
        await fetchEmployees();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error deleting employee");
      console.error("Delete Error:", error);
    }
  
    setIsDeleteModalOpen(false);
    setDeleteEmployeeId(null);
  };
  

  const handleEditProduct = () => {};

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="relative w-full border rounded-md shadow-sm bg-white mt-2">
      {/* Header */}
      <header className="py-3 px-5 flex justify-between items-center border-b">
        <h3 className="text-lg font-medium text-primary-text">Employee List</h3>
        <div className="flex items-center gap-x-3">
          <div className="searchbar border px-3 py-2 rounded-md flex items-center gap-x-2">
            <IoSearch className="text-[#8b8b8b]" />
            <input
              type="text"
              placeholder="Search"
              className="w-40 outline-none bg-transparent text-sm"
            />
          </div>

          <button
            className="text-sm bg-primary-txt px-3 py-2 rounded-md text-white flex items-center gap-x-2"
            onClick={() => {
              setEditEmployee(null);
              setIsFormOpen(true);
            }}
          >
            <IoAdd className="text-lg" />
            <p>Add Employee</p>
          </button>
        </div>
      </header>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead className="bg-[#f7f7f7] text-primary-text uppercase text-sm">
          <tr>
            {[
              "#",
              "Name",
              "Email",
              "Designation",
              "Work Mode",
              "Status",
              "Actions",
            ].map((heading, index) => (
              <th
                key={index}
                className="px-5 py-3 text-center font-medium text-sm"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {displayedEmployees.map((employee, index) => (
            <tr key={employee._id} className="border-b transition text-sm">
              <td className="py-3 px-5 text-center text-base">
                {startIndex + index + 1}
              </td>
              <td className="py-3 px-5 text-center text-base">{employee.name || "--"}</td>
              <td className="py-3 px-5 text-center text-base">{employee.email || "--"}</td>
              <td className="py-3 px-5 text-center text-base">{employee.designation || "--"}</td>
              <td className="py-3 px-5 text-center text-base">{employee.work_type || "--"}</td>
              <td className="py-3 px-5 text-center text-base">
                <p
                  className={`w-fit mx-auto rounded-full px-2 py-1 text-base font-semibold ${getStatusColor(
                    employee.status
                  )}`}
                >
                  {employee.status || "--"}
                </p>
              </td>
              <td className="py-2 px-5 text-center space-x-2 flex justify-center">
                {/* Edit */}
                <button
                  className="relative group border p-2 rounded-md"
                  onClick={() => {
                    setEditEmployee(employee);
                    setIsEditFormOpen(true);
                  }}
                >
                  <CiEdit />
                  <span className="absolute hidden group-hover:block text-xs text-white bg-gray-800 px-2 py-1 rounded-md -top-8 left-1/2 -translate-x-1/2 z-10">
                    Edit
                  </span>
                </button>

                {/* Delete */}
                <button
                  className="relative group border p-2 rounded-md"
                  onClick={() => {
                    setDeleteEmployeeId(employee._id);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <RiDeleteBin7Line />
                  <span className="absolute hidden group-hover:block text-xs text-white bg-gray-800 px-2 py-1 rounded-md -top-8 left-1/2 -translate-x-1/2 z-10">
                    Delete
                  </span>
                </button>

                {/* Star */}
                <button className="relative group border p-2 rounded-md">
                  <FaRegStar />
                  <span className="absolute hidden group-hover:block text-xs text-white bg-gray-800 px-2 py-1 rounded-md -top-8 left-1/2 -translate-x-1/2 z-10">
                    Star
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center p-4 border-t">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-primary-btn text-white rounded-md disabled:bg-primary-bg disabled:text-primary-txt"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-primary-btn text-white rounded-md disabled:bg-primary-bg disabled:text-primary-txt"
        >
          Next
        </button>
      </div>

      {/* Add/Edit Form */}
      {isFormOpen && (
        <AddNewEmployee
          onClose={() => setIsFormOpen(false)}
          productToEdit={editEmployee}
          fetchEmployees = {fetchEmployees}
        />
      )}

      {isEditFormOpen && (
        <EditEmployeeDetails
          onClose={() => setIsEditFormOpen(false)}
          onSubmit={handleEditProduct}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteEmployeeModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminEmployees;
