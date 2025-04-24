import React, { useState } from "react";
import toast from "react-hot-toast";
import useAxios from "../../utils/validator/useAxios";
import PasswordFieldComponent from "../form_components/PasswordFieldComponent";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoAdd } from "react-icons/io5";

const ChangePasswordModal = ({ onClose }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const axiosInstance = useAxios();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    console.log("handleChangePassword called");
    try {
      if (password != confirmPassword) {
        toast.error("Both password should match");
        return;
      }
      const response = await axiosInstance.put("/api/auth/changePassword", {newPassword:password});
      if(response.status == 200){
        console.log("inside ok status");
        toast.success(response.data.message || "Password Changed Successfully!");
        onClose();
      }else{
        toast.error(response.data.message || "Failed to change the Password");
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
            <IoAdd className="text-sky text-2xl font-semibold" />
          </div>
          <h2 className="text-2xl font-medium text-left">Change Password</h2>
        </span>

        <form
          className="grid grid-cols-2 gap-4"
        >
          <PasswordFieldComponent
            label="Password"
            name="password"
            id="password"
            placeholder="Enter your password"
            icon={RiLockPasswordFill}
            value={password}
            onChange={setPassword}
            required={true}
          />

          <PasswordFieldComponent
            label="ConfirmPassword"
            name="confirmpassword"
            id="confirmpassword"
            placeholder="Re-enter your password"
            icon={RiLockPasswordFill}
            value={confirmPassword}
            onChange={setConfirmPassword}
            required={true}
          />

          <div className="col-span-2 flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#f1f1f1] shadow-sm rounded-md"
            >
              Discard
            </button>
            <button
              onClick={handleChangePassword}
              className="px-4 py-2 bg-sky text-white rounded-md"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
