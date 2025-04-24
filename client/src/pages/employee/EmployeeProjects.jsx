import { useEffect, useState } from "react";
import { FaCheckCircle, FaClock, FaUsers, FaTasks, FaCalendar } from "react-icons/fa";
import useAxios from "../../utils/validator/useAxios";
import toast from "react-hot-toast";
import NoData from "../../assets/nodata.svg";
const authString = localStorage.getItem("auth");
const auth = authString ? JSON.parse(authString) : null;
import { GrOrganization } from "react-icons/gr";
import { FaBriefcase } from "react-icons/fa6";
import ProjectInfoTags from "../../components/employee_components/ProjectInfoTags";

const EmployeeProjects = () => {
  const [projects, setProjects] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "ongoing":
        return "text-sky bg-sky-op";
      default:
        return "text-gray-600";
    }
  };

  const formLocalStringDate = (value) =>{
    return new Date(value).toLocaleDateString();
  }

  const axiosInstance = useAxios();

  // const getProgressColor = (progress) => {
  //   if (progress >= 75) return "bg-green-600";
  //   if (progress >= 50) return "bg-blue-600";
  //   if (progress >= 25) return "bg-yellow-600";
  //   return "bg-red-600";
  // };

  const fetchProjects = async () => {
    console.log('inside fetch projects');
    
    try {
      const email = auth.user.email;
      console.log(`user email: ${email}`);
      const response = await axiosInstance.post(`/api/employee/getProjects`, {
        email,
      });
      if (response.status === 200) {
        setProjects(response.data);
      } else {
        toast.error(response.data.message || "Error in fetching projects data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">All Projects ({projects.length})</h1>
        <div className="flex space-x-4">
          <select className="bg-white border rounded-lg px-4 py-2 text-gray-700">
            <option value="">All Projects</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {projects.length != 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* Project Header */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {project.title}
                  </h2>
                  <span className={`px-3 py-1 ${getStatusColor(project.status)} rounded-full text-sm`}>
                    {project.status}
                  </span>
                </div>

                {/* Progress Bar
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${getProgressColor(
                      project.progress
                    )} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div> */}

                {/* Project Info */}
                <div className="flex gap-3 mb-3">
                  <ProjectInfoTags Icon={GrOrganization} value={project.client_name} />
                  <ProjectInfoTags Icon={FaCalendar} value={`${formLocalStringDate(project.start_date)}  to  ${formLocalStringDate(project.end_date)}`} />
                  <ProjectInfoTags Icon={FaBriefcase} value={project.office_based ? "Office" : "Onsite"} />
                </div>

                <div>
                  <p>{project.description}</p>
                </div>

                {/* Tasks */}
                {/* <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Recent Tasks
                  </h3>
                  <div className="space-y-3">
                    {project.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FaTasks className={getStatusColor(task.status)} />
                          <span className="text-sm text-gray-700">
                            {task.title}
                          </span>
                        </div>
                        <span
                          className={`text-sm capitalize ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status.replace("-", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      )}

      {projects.length == 0 && (
        <div className="p-3 flex justify-center items-center flex-col">
          <img src={NoData} alt="no projects assigned" style={{height: '25rem'}}/>
          <h4 className="text-lg font-semibold text-[#333]">
            No Projects Assigned Yet
          </h4>
        </div>
      )}
    </div>
  );
};

export default EmployeeProjects;
