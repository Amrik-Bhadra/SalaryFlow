import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AuthLayout from "./layouts/AuthLayout";
import LoginForm from "./pages/auth/LoginForm";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ProtectedRoute from "./contexts/ProtectedRoute";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import AdminEmployees from "./pages/admin/AdminEmployees";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminHelp from "./pages/admin/AdminHelp";

import EmployeeLayout from "./layouts/EmployeeLayout";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeAttendance from "./pages/employee/EmployeeAttendance";
import EmployeeProjects from "./pages/employee/EmployeeProjects";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import EmployeePayslips from "./pages/employee/EmployeePayslips";

import ErrorPage from "./pages/ErrorPage";

const App = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/auth/login" replace />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/employee",
      element: (
        <ProtectedRoute>
          <EmployeeLayout />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/employee",
          element: <EmployeeDashboard />,
        },
        {
          path: "attendance",
          element: <EmployeeAttendance />,
        },
        {
          path: "projects",
          element: <EmployeeProjects />,
        },
        {
          path: "profile",
          element: <EmployeeProfile />,
        },
        {
          path: "payslips",
          element: <EmployeePayslips />,
        },
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/admin",
          element: <AdminDashboard />,
        },
        {
          path: "employees",
          element: <AdminEmployees/>
        },
        {
          path: "projects",
          element: <AdminProjects/>
        },
        {
          path: "attendance",
          element: <AdminAttendance/>
        },
        {
          path: "report",
          element: <AdminReports/>
        },
        {
          path: "settings",
          element: <AdminSettings />,
        },
        {
          path: "help",
          element: <AdminHelp />,
        }
      ],
    },

    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <LoginForm />,
        },
        {
          path: "verifyotp",
          element: <VerifyOTP />,
        },
        {
          path: "forgotpassword",
          element: <ForgetPassword/>
        },
        {
          path: "resetpassword",
          element: <ResetPassword/>
        }
      ],
    },
  ]);
  return (
    <>
      <Toaster position="top-center" />
      <RouterProvider router={routes} />
    </>
  );
};

export default App;
