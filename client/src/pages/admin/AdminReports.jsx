import { useState, useCallback, useEffect } from "react";
import {
  FaDownload,
  FaEye,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaSearch,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import NoData from "../../assets/nodata.svg";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import useAxios from "../../utils/validator/useAxios";
import GeneratePayslipReportModal from "../../components/admin_report_page/GeneratePayslipReportModal";
import { IoDocumentText } from "react-icons/io5";
import DeleteReportModal from "../../components/admin_report_page/DeleteReportModal";

const AdminReports = () => {
  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [reports, setReports] = useState([]);
  const [isDeleteModalOpen, setOpenDeleteModal] = useState(false);
  const axiosInstance = useAxios();

  const [generateModalOpen, setOpenGenerateModal] = useState(false);

  const generatePDF = async (payslip) => {
    if (isGeneratingPDF) return;
    setIsGeneratingPDF(true);

    try {
      console.log("Starting PDF generation...");

      // Create new PDF document (A4 format)
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      console.log("PDF document created");

      // Set document properties
      doc.setProperties({
        title: `Payslip-${new Date(payslip.payment_date).toLocaleString()}`,
        subject: "Employee Payslip",
        author: "SalaryFlow",
        keywords: "payslip, salary",
        creator: "SalaryFlow",
      });

      // Define page margins
      const margin = 20;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Add company header
      doc.setFontSize(20);
      doc.setTextColor(41, 98, 255);
      doc.text("SalaryFlow", pageWidth / 2, margin, { align: "center" });

      // Add payslip title
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(
        `Payslip for ${new Date(payslip.payment_date).toLocaleString()}`,
        pageWidth / 2,
        margin + 10,
        { align: "center" }
      );

      // Add employee info
      autoTable(doc, {
        startY: margin + 20,
        head: [],
        body: [
          ["Name", payslip.employee_id.name],
          ["Employee ID", payslip.employee_id._id],
          ["Role", payslip.employee_id.designation],
          ["Payment Date", new Date(payslip.payment_date).toLocaleDateString()],
        ],
        theme: "plain",
        styles: {
          fontSize: 10,
          cellPadding: 2,
        },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 40 },
          1: { cellWidth: 60 },
        },
      });

      // Calculate total earnings
      const totalEarnings =
        payslip.basic_salary +
        payslip.hra +
        payslip.transport +
        payslip.medical;

      const allowances = {
        hra: payslip.hra,
        transport: payslip.transport,
        medical: payslip.medical,
      };

      // Add earnings table
      const earningsData = [
        ["Basic Salary", formatCurrency(payslip.basic_salary)],
        ...Object.entries(allowances).map(([key, value]) => [
          key.charAt(0).toUpperCase() + key.slice(1),
          formatCurrency(value),
        ]),
        ["Total Earnings", formatCurrency(totalEarnings)],
      ];

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Earnings", "Amount"]],
        body: earningsData,
        headStyles: {
          fillColor: [41, 98, 255],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        footStyles: {
          fillColor: [240, 244, 255],
          textColor: [41, 98, 255],
          fontStyle: "bold",
        },
        theme: "grid",
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 60, halign: "right", overflow: "linebreak" },
        },
      });

      const deductions = {
        tax: payslip.tax,
        pf: payslip.pf,
        insurance: payslip.insurance,
      };

      // Calculate total deductions
      const totalDeductions = Object.values(deductions).reduce(
        (a, b) => a + b,
        0
      );

      // Add deductions table
      const deductionsData = [
        ...Object.entries(deductions).map(([key, value]) => [
          key.charAt(0).toUpperCase() + key.slice(1),
          formatCurrency(value),
        ]),
        ["Total Deductions", formatCurrency(totalDeductions)],
      ];

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Deductions", "Amount"]],
        body: deductionsData,
        headStyles: {
          fillColor: [220, 53, 69],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        footStyles: {
          fillColor: [255, 240, 242],
          textColor: [220, 53, 69],
          fontStyle: "bold",
        },
        theme: "grid",
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 60, halign: "right", overflow: "linebreak" },
        },
      });

      // Add net pay summary
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Summary", "Amount"]],
        body: [["Net Pay", formatCurrency(payslip.net_salary)]],
        headStyles: {
          fillColor: [25, 135, 84],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        bodyStyles: {
          fillColor: [240, 249, 244],
          textColor: [25, 135, 84],
          fontStyle: "bold",
        },
        theme: "grid",
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 60, halign: "right", overflow: "linebreak" },
        },
      });

      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        "This is a computer-generated document. No signature is required.",
        pageWidth / 2,
        pageHeight - margin,
        { align: "center" }
      );

      const date = new Date(payslip.payment_date).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });

      // Save the PDF
      doc.save(`Payslip-${date.split(" ").join("_")}.pdf`);
      toast.success("Payslip downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(
        `PDF Generation Error: ${error.message || "Unknown error occurred"}`
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownload = (payslip) => {
    console.log("Download requested for payslip:", payslip);
    generatePDF(payslip);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // const filteredPayslips = payslips.filter(
  //   (payslip) =>
  //     payslip.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     payslip.year.toString().includes(searchTerm)
  // );

  const getPaySlips = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/getPaySlipReportsByYear?year=${selectedYear}`
      );

      if (response.status === 200) {
        setReports(response.data);
        console.log("Fetched payslips: ", response.data);
      } else {
        console.log("Error fetching payslips:", response.message);
      }
    } catch (err) {
      console.error("Error fetching payslips: ", err);
      toast.error("Error fetching payslips");
    }
  }, [axiosInstance, selectedYear]);

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `/admin/deletePayslipReport/${selectedReport._id}`
      );
      if (response.status === 200) {
        toast.success("Payslip Report deleted successfully!");
        setOpenDeleteModal(false);
        getPaySlips();
      } else {
        toast.error("Failed to delete payslip report");
      }
    } catch (err) {
      console.error("Error deleting payslip report: ", err);
      toast.error("Error deleting payslip report");
    }
  };

  useEffect(() => {
    getPaySlips();
  }, [getPaySlips]);

  return (
    <div className="space-y-6 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payslip List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Report History
              </h2>

              <div className="flex items-center justify-center gap-x-2">
                {/* Year Dropdown */}
                <select
                  className="border rounded px-2 py-1"
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

                <button
                  onClick={() => setOpenGenerateModal(true)}
                  className="px-4 py-1 bg-primary-btn-hover hover:bg-primary-btn text-white rounded-md font-semibold"
                >
                  Generate Report
                </button>
              </div>
            </div>
            {reports.length > 0 ? (
              <div className="space-y-4 h-fit">
                {reports.map((report) => (
                  <div
                    key={report._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <IoDocumentText className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {report.report_title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Date:{" "}
                          {new Date(report.report_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(report);
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        title="Download Payslip"
                      >
                        <FaDownload />
                      </button>
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setOpenDeleteModal(true);
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        title="Delete"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg text-gray-500 py-2">
                <img src={NoData} alt="no-data" className="h-44" />
                No Report found!
              </div>
            )}
          </div>
        </div>

        {/* Payslip Details */}
        <div className="lg:col-span-1">
          {selectedReport ? (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Report Details
                </h2>
                <button
                  onClick={() => handleDownload(selectedReport)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <FaDownload />
                  <span>Download</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Report Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(
                          selectedReport.report_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Earnings */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Payments Done!
                  </h3>
                  <div className="space-y-2">
                    {selectedReport.payed_employees.map((emp, key) => (
                      <div className="flex justify-between py-1" key={key}>
                        <span className="text-gray-600 capitalize">
                          {emp.name}
                        </span>
                        <span className="font-medium text-green-600">
                          ₹ {emp.payslip_data?.net_salary?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Payments Yet To Done!
                  </h3>
                  <div className="space-y-2">
                    {selectedReport.not_payed_employees.map((emp, key) => (
                      <div className="flex justify-between py-1" key={key}>
                        <span className="text-gray-600 capitalize">
                          {emp.name}
                        </span>
                        <span className="font-medium text-red-600">
                          ₹{" "}
                          {emp.payslip_data?.net_salary?.toLocaleString() ||
                            "0"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Net Pay */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Net Pay</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(selectedReport.net_salary)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center h-full text-center">
              <IoDocumentText className="text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                Select a Report
              </h3>
              <p className="text-gray-500 mt-2">
                Click on any Report to view its details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Payslip Modal */}
      {generateModalOpen && (
        <GeneratePayslipReportModal
          onClose={() => setOpenGenerateModal(false)}
          getPaySlips={getPaySlips}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteReportModal
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={handleDelete}
          selectedReport={selectedReport}
        />
      )}
    </div>
  );
};

export default AdminReports;
