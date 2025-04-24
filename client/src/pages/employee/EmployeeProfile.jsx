import { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCalendarAlt,
  FaEdit,
  FaCamera,
} from "react-icons/fa";

import { FaBuilding } from "react-icons/fa6";
import ProfilePictureUpload from "../../components/ProfilePictureUpload";
import toast from "react-hot-toast";
import useAxios from "../../utils/validator/useAxios";
import { useAuth } from "../../contexts/AuthContext";
import ChangePasswordModal from "../../components/employee_components/ChangePasswordModal";

const EmployeeProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileUploadOpen, setIsProfileUploadOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isChangePassModal, setIsChangePasswordModal] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    designation: "",
    work_type: "",
    status: "",
  });
  const [password, setPassword] = useState({
    password: "",
    confirmPassword: "",
  });
  const { auth, setAuth } = useAuth();
  const axiosInstance = useAxios();
  // const authString = localStorage.getItem("auth");
  // const auth = authString ? JSON.parse(authString) : null;

  const handleProfilePictureCropped = (croppedImage) => {
    setProfilePicture(croppedImage);
    setIsProfileUploadOpen(false);
    toast.success("Profile picture updated successfully!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsEditing(false);
    console.log("inside handleSave");
    // Add API call to save profile changes
    try {
      console.log("profile: ", { ...profile });
      const response = await axiosInstance.put("/api/employee/updateEmployee", {
        ...profile,
      });
      if (response.status == 200) {
        toast.success("Profile updated successfully!");
        const updatedUser = {
          ...auth.user,
          name: response.data.data.name,
          role: response.data.data.role,
        };

        setAuth({ ...auth, user: updatedUser });
      } else {
        toast.error("Failed to Update Profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployeeData = async () => {
    if (!auth.user || !auth.user.email) {
      console.warn("No user info yet, skipping fetch.");
      return;
    }
  
    try {
      const email = auth?.user?.email;
      const response = await axiosInstance.get("/api/employee/getData", {
        params: { email },
      });
      if (response.status == 200) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  return (
    <div className="relative space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <button
                  onClick={() => setIsProfileUploadOpen(true)}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-primary-btn rounded-full flex items-center justify-center text-white hover:bg-blue-700 shadow-lg"
                >
                  <FaCamera className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile.name || "---"}
              </h2>
              <p className="text-gray-600">{profile.designation || "---"}</p>
              <p className="text-sm text-gray-500">
                {profile.status || "active"}
              </p>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-3 flex items-center space-x-2 px-4 py-2 bg-sky text-white rounded-lg hover:bg-sky"
              >
                <FaEdit />
                <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
              </button>

              <button
                onClick={() => setIsChangePasswordModal(!isChangePassModal)}
                className="mt-3 flex items-center space-x-2 px-4 py-2 border text-[#333] border-primary-btn-hover hover:text-white rounded-lg hover:bg-primary-btn-hover transition-all ease-linear"
              >
                <span>Change Password</span>
              </button>
            </div>

            {/* <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div> */}
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Personal Information
            </h2>

            {/* name block */}
            <div className="space-y-6">
              {isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-sm text-gray-600">Name</label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaUser className="text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        disabled={!isEditing}
                        className="bg-transparent w-full outline-none"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Email</label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FaEnvelope className="text-gray-400" />
                    <input
                      type="email"
                      value={profile.email}
                      disabled={!isEditing}
                      className="bg-transparent w-full outline-none"
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Phone</label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FaPhone className="text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      disabled={!isEditing}
                      className="bg-transparent w-full outline-none"
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Address</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    disabled={!isEditing}
                    className="bg-transparent w-full outline-none"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Work Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Designation</label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FaBriefcase className="text-gray-400" />
                    <input
                      type="text"
                      name="designation"
                      value={profile.designation}
                      disabled={!isEditing}
                      className="bg-transparent w-full outline-none"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Work Type</label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FaBuilding className="text-gray-400" />
                    <input
                      type="text"
                      name="work_type"
                      value={profile.work_type}
                      disabled={!isEditing}
                      className="bg-transparent w-full outline-none"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Picture Upload Modal */}
      {isProfileUploadOpen && (
        <ProfilePictureUpload
          onImageCropped={handleProfilePictureCropped}
          onClose={() => setIsProfileUploadOpen(false)}
        />
      )}

      {isChangePassModal && (
        <ChangePasswordModal
          onClose={() => {
            setIsChangePasswordModal(false);
          }}
          password={password}
          setPassword={setPassword}
        />
      )}
    </div>
  );
};

export default EmployeeProfile;
