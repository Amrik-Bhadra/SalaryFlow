import { useState, useEffect } from "react";
import LocationPickerModal from "./LocationPickerModal";
import useAxios from "../../utils/validator/useAxios";
import toast from "react-hot-toast";
import { CiEdit } from "react-icons/ci";

const EditProjectModal = ({ onClose, fetchProjects, project }) => {
  const [position, setPosition] = useState([
    project.location?.latitude || "",
    project.location?.longitude || "",
  ]);
  const formatDate = (isoDate) => {
    return isoDate ? isoDate.split("T")[0] : "";
  };
  
  const [formData, setFormData] = useState({
    title: project.title || "",
    client_name: project.client_name || "",
    description: project.description || "",
    project_type: (project.office_based ? "Office" : "Onsite") || "",
    status: project.status || "",
    latitude: project.location.latitude || "",
    longitude: project.location.longitude || "",
    start_date: formatDate(project.start_date),
    end_date: formatDate(project.end_date),
  });
  

  const [employees, setEmployees] = useState(
    (project.assigned_employees || []).map((emp) =>
      typeof emp === "string" ? emp : emp.email
    )
  );

  console.log(`Employees: ${employees[0]}`);

  const [modalOpen, setModalOpen] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get("/api/employee/getEmployees"); // update endpoint
        setAllEmployees(res.data); // adjust based on actual data
      } catch (error) {
        console.error("Error fetching employees", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toISOString = (date) => {
    return date ? new Date(date).toISOString() : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log();
    try {
      const response = await axiosInstance.put(`/admin/updateProject/${project._id}`, {
        ...formData,
        latitude: position[0],
        longitude: position[1],
        employees,
        start_date: toISOString(formData.start_date),
        end_date: toISOString(formData.end_date)
      });

      if (response.status === 200) {
        toast.success(response.data.message || "Project Updated Successfully!");
        fetchProjects();
        onClose();
      } else {
        toast.error("Error in creating project");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] max-w-xl relative">
        <span className="flex gap-x-2 items-center mb-6">
          <div className="p-2 rounded-full bg-sky bg-opacity-[30%] border border-sky">
            <CiEdit className="text-sky text-2xl font-semibold" />
          </div>
          <h2 className="text-2xl font-medium text-left">Edit Project</h2>
        </span>

        <form className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">
              Project Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">
              Client Name
            </label>
            <input
              type="text"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Work Type</label>
            <select
              name="project_type"
              value={formData.project_type}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="" disabled>
                Select Project Type
              </option>
              <option value="false">Onsite</option>
              <option value="true">Office</option>
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
              <option value="" disabled>
                Select Status
              </option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {formData.project_type === "Onsite" && (
            <div className="col-span-2 flex gap-x-4 items-end">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">
                  Latitude
                </label>
                <input
                  type="text"
                  name="latitude"
                  value={position[0]}
                  onChange={handleChange}
                  required={formData.project_type === "false"}
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>

              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">
                  Longitude
                </label>
                <input
                  type="text"
                  name="longitude"
                  value={position[1]}
                  onChange={handleChange}
                  required={formData.project_type === "false"}
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>

              <button
                type="button"
                className="border w-fit h-fit px-5 py-2 rounded-md bg-primary-btn-hover hover:bg-primary-btn text-white font-semibold"
                onClick={() => setModalOpen(true)}
              >
                Find
              </button>
            </div>
          )}

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Employees</label>

            <select
              value=""
              onChange={(e) => {
                const email = e.target.value;
                const employee = allEmployees.find(
                  (emp) => emp.email === email
                );
                if (employee && !employees.includes(email)) {
                  setEmployees([...employees, email]);
                }
              }}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="" disabled>
                Select employee
              </option>
              {allEmployees.map((emp) => (
                <option
                  key={emp.email}
                  value={emp.email}
                  disabled={employees.includes(emp.email)}
                >
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2 mt-2">
              {employees.map((email, idx) => (
                <div
                  key={idx}
                  className="bg-sky text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                >
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setEmployees(employees.filter((e) => e !== email))
                    }
                    className="text-white font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Start Date Field */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>

          {/* End Date Field */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
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
              onClick={handleSubmit}
              className="px-4 py-2 bg-sky text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>

        <LocationPickerModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          position={position}
          setPosition={setPosition}
        />
      </div>
    </div>
  );
};

export default EditProjectModal;
