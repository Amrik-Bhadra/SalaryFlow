import { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import useAxios from "../../utils/validator/useAxios";

const GeneratePayslipReportModal = ({ onClose, getPaySlips }) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  //   const [userEmail, setUserEmail] = useState("");
  const axiosInstance = useAxios();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        `/admin/generatePayslipReport?month=${selectedMonth}&year=${selectedYear}`,
      );
      if (response.status === 200) {
        toast.success("Payslip Report generated successfully successfully!");
        getPaySlips();
        onClose();
      } else {
        toast.error(response.data.message || "Failed to add employee");
      }
    } catch (err) {
      console.error("API Error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] max-w-xl relative">
        <span className="flex gap-x-2 items-center mb-6">
          <div className="p-2 rounded-full bg-sky bg-opacity-[30%] border border-sky">
            <IoAddOutline className="text-sky text-2xl font-semibold" />
          </div>
          <h2 className="text-2xl font-medium text-left">Generate Payslip Report</h2>
        </span>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div className="col-span-1 w-full">
            <label className="block text-sm font-medium mb-2">Select Month</label>
            <select
              className="border rounded px-2 py-1 w-full"
              name="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1 w-full">
            <label className="block text-sm font-medium mb-2">
              Select Year
            </label>
            <select
              className="border rounded px-2 py-1 w-full"
              name="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {Array.from({ length: 11 }, (_, i) => {
                const year = new Date().getFullYear() - 5 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
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
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratePayslipReportModal;
