import { useEffect, useState } from "react";
import useAxios from "../../utils/validator/useAxios";
import ProjectStatsCards from "../../components/admin_projects_page/ProjectStatsCards";
import { IoSearch } from "react-icons/io5";
import { IoAdd } from "react-icons/io5";
import NoData from "../../assets/nodata.svg";
import AddNewProject from "../../components/admin_projects_page/AddNewProjects";
import EditProjectModal from "../../components/admin_projects_page/EditProjectModal";
import DeleteProjectModal from "../../components/admin_projects_page/DeleteProjectModal";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin7Line } from "react-icons/ri";
import { FaRegStar } from "react-icons/fa";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-success-op text-success border border-success";
    case "ongoing":
      return "bg-rose-op text-rose border border-rose";
    default:
      return "bg-star-op text-star border border-star";
  }
};

const AdminProjects = () => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // const [selectedRows, setSelectedRows] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isNewProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [isEditProjectFormOpen, setIsEditFormOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteProject, setDeleteProject] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProjects = projects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // const toggleRowSelection = (id) => {
  //   setSelectedRows((prev) =>
  //     prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
  //   );
  // };

  // const isRowSelected = (id) => selectedRows.includes(id);
  const axiosInstance = useAxios();

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance("/admin/getProjects");
      if (response.status === 200) {
        setProjects(response.data);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Fetch Projects Error:", error);
    }
  };

  const handleDelete = async (e) => {
      e.preventDefault();
      try {
        const response = await axiosInstance.delete(
          "/admin/deleteProject",
          { data: { deleteProject } }
        );
  
        if (response.status === 200) {
          toast.success(response.data.message || "Project Deleted Successfully!");
          await fetchProjects();
        } else {
          toast.error(response.data.message || "Failed To Delete Project");
        }
      } catch (error) {
        toast.error("Error deleting employee");
        console.error("Delete Error:", error);
      }
  
      setIsDeleteModalOpen(false);
      setDeleteProject(null);
    };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <div className="order-cards-div w-full rounded-md py-2 flex justify-between gap-x-4">
        <ProjectStatsCards
          isIncrease={true}
          title={"Total Orders"}
          description={840}
          value={16.8}
        />
        <ProjectStatsCards
          isIncrease={false}
          title={"Cancel Orders"}
          description={20}
          value={8.5}
        />
        <ProjectStatsCards
          isIncrease={false}
          title={"Pending Orders"}
          description={83}
          value={3.4}
        />
        <ProjectStatsCards
          isIncrease={true}
          title={"Return Orders"}
          description={130}
          value={9.0}
        />
      </div>

      <div className="relative w-full border rounded-md shadow-sm bg-white mt-2">
        <header className="py-3 px-5 flex justify-between items-center border-b">
          <h3 className="text-lg font-medium text-primary-text">
            Project List
          </h3>
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
                setEditProject(null);
                setNewProjectModalOpen(true);
              }}
            >
              <IoAdd className="text-lg" />
              <p>New Project</p>
            </button>
          </div>
        </header>

        {projects.length == 0 ? (
          <div className="p-5 flex justify-center items-center">
            <div className="flex flex-col items-center justify-center">
              <img
                src={NoData}
                alt="no-data-illustration"
                style={{ height: "20rem" }}
              />
              <p className="text-lg font-semibold text-[#333]">
                No Projects Yet
              </p>
            </div>
          </div>
        ) : (
          <>
            <table className="w-full border-collapse">
              <thead className="bg-[#f7f7f7] text-primary-text uppercase text-sm">
                <tr>
                  {/* <th className="px-5 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedRows(
                          e.target.checked
                            ? projects.map((order) => order.id)
                            : []
                        )
                      }
                      checked={selectedRows.length === projects.length}
                    />
                  </th> */}
                  {[
                    "#",
                    "Title",
                    "Client",
                    "Location",
                    "Start Date",
                    "End Date",
                    "Project Type",
                    "Number of Members",
                    "Status",
                    "Action",
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
                {displayedProjects.map((project, index) => (
                  <tr
                    key={index}
                    // className={`border-b transition text-sm ${
                    //   isRowSelected(project.id) ? "bg-gray-100" : ""
                    // }`}
                  >
                    {/* <td className="py-3 px-5 text-left">
                      <input
                        type="checkbox"
                        onChange={() => toggleRowSelection(project.id)}
                        checked={isRowSelected(project.id)}
                      />
                    </td> */}
                    <td className="py-3 px-5 text-left">
                      {startIndex + index + 1}
                    </td>
                    <td className="py-3 px-5 text-center">{project.title}</td>
                    <td className="py-3 px-5 text-center">
                      {project.client_name}
                    </td>
                    <td className="py-3 px-5 text-center">
                      {project.location.latitude}
                    </td>
                    <td className="py-3 px-5 text-center">
                      {project.start_date
                        ? project.start_date.slice(0, 10)
                        : "N/A"}
                    </td>
                    <td className="py-3 px-5 text-center">
                      {project.end_date ? project.end_date.slice(0, 10) : "N/A"}
                    </td>
                    <td className="py-3 px-5 text-center">
                      {project.office_based ? "Office" : "Onsite"}
                    </td>
                    <td className="py-3 px-5 text-center">
                      {project.assigned_employees.length}
                    </td>
                    <td className="py-3 px-5 text-center">
                      <p
                        className={`rounded-full p-1 ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </p>
                    </td>
                    <td className="py-2 px-5 text-center space-x-2 flex justify-center">
                      {/* Edit */}
                      <button
                        className="relative group border p-2 rounded-md"
                        onClick={() => {
                          setEditProject(project);
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
                          setDeleteProject(project._id);
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

            {/* pagination footer */}
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
          </>
        )}

        {isDetailOpen && (
          <OrderDetails
            onClose={() => {
              setIsDetailOpen(false);
            }}
          />
        )}
      </div>

      {isNewProjectModalOpen && (
        <AddNewProject
          onClose={() => setNewProjectModalOpen(false)}
          fetchProjects={fetchProjects}
        />
      )}

      {isEditProjectFormOpen && (
        <EditProjectModal
          onClose={() => setIsEditFormOpen(false)}
          fetchProjects={fetchProjects}
          project={editProject}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteProjectModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default AdminProjects;
