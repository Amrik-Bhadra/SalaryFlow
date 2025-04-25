import { useState, useEffect } from "react";
import {
  FaDownload,
  FaEye,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaSearch,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
const authString = localStorage.getItem("auth");
const auth = authString ? JSON.parse(authString) : null;
import useAxios from "../../utils/validator/useAxios";

const EmployeePayslips = () => {
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [payslips, setPayslips] = useState([]);
  const axiosInstance = useAxios();

  // const payslips = [
  //   {
  //     id: 1,
  //     month: "March",
  //     year: 2024,
  //     salary: 85000,
  //     netPay: 72500,
  //     paymentDate: "2024-03-31",
  //     deductions: {
  //       tax: 8500,
  //       pf: 2500,
  //       insurance: 1500,
  //     },
  //     allowances: {
  //       hra: 25000,
  //       transport: 5000,
  //       medical: 2000,
  //     },
  //   },
  //   {
  //     id: 2,
  //     month: "February",
  //     year: 2024,
  //     salary: 85000,
  //     netPay: 72500,
  //     paymentDate: "2024-02-29",
  //     deductions: {
  //       tax: 8500,
  //       pf: 2500,
  //       insurance: 1500,
  //     },
  //     allowances: {
  //       hra: 25000,
  //       transport: 5000,
  //       medical: 2000,
  //     },
  //   },
  //   // Add more payslip history here
  // ];

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
        `Payslip for ${new Date(payslip.payment_date).toLocaleString(
          "en-US",
          { timeZone: "UTC", month: "long", year: "numeric" }
        )}`,
        pageWidth / 2,
        margin + 10,
        { align: "center" }
      );

      // Add employee info
      autoTable(doc, {
        startY: margin + 20,
        head: [],
        body: [
          ["Name", auth.user.name],
          ["Employee ID", payslip.employee_id],
          ["Role", auth.user.role],
          ["Payment Date", new Date(payslip.payment_date).toLocaleDateString(
            "en-US",
            { timeZone: "UTC" }
          )],
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
        timeZone: "UTC",
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

  const getPaySlips = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/employee/getPayslipsData",
        { email: auth.user.email }
      );

      if (response.status === 200) {
        setPayslips(response.data.data);
        console.log("Fetched payslips: ", response.data.data);
      } else {
        console.log("Error fetching payslips:", response.message);
      }
    } catch (err) {
      console.error("Error fetching payslips: ", err);
      toast.error("Error fetching payslips");
    }
  };

  useEffect(() => {
    getPaySlips();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Payslips</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by month or year..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payslip List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Payslip History
            </h2>
            <div className="space-y-4">
              {payslips.map((payslip) => (
                <div
                  key={payslip.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setSelectedPayslip(payslip)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <FaMoneyBillWave className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {new Date(payslip.payment_date).toLocaleString(
                          "en-US",
                          {
                            timeZone: "UTC",
                            year: "numeric",
                            month: "long",
                          }
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Net Pay: {formatCurrency(payslip.net_salary)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(payslip);
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title="Download Payslip"
                    >
                      <FaDownload />
                    </button>
                    <button
                      onClick={() => setSelectedPayslip(payslip)}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payslip Details */}
        <div className="lg:col-span-1">
          {selectedPayslip ? (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Payslip Details
                </h2>
                <button
                  onClick={() => handleDownload(selectedPayslip)}
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
                      <p className="text-sm text-gray-600">Payment Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(
                          selectedPayslip.payment_date
                        ).toLocaleDateString(
                          "en-US",
                          { timeZone: "UTC" }
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Earnings */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Earnings
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Basic Salary</span>
                      <span className="font-medium">
                        {formatCurrency(selectedPayslip.basic_salary)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 capitalize">HRA</span>
                      <span className="font-medium">
                        {formatCurrency(selectedPayslip.hra)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 capitalize">
                        Transport
                      </span>
                      <span className="font-medium">
                        {formatCurrency(selectedPayslip.transport)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 capitalize">Medical</span>
                      <span className="font-medium">
                        {formatCurrency(selectedPayslip.medical)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Deductions
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 capitalize">Tax</span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(selectedPayslip.tax)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 capitalize">PF</span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(selectedPayslip.pf)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 capitalize">
                        Insurance
                      </span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(selectedPayslip.insurance)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Net Pay */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Net Pay</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(selectedPayslip.net_salary)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center h-full text-center">
              <FaMoneyBillWave className="text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                Select a Payslip
              </h3>
              <p className="text-gray-500 mt-2">
                Click on any payslip to view its details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeePayslips;
