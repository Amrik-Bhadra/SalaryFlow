import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

const App = () => {
  const routes = createBrowserRouter([
    // {
    //   path: "/",
    //   element: <EmployeeLayout />,
    //   children: [
    //     {
    //       path: "/",
    //       element: <EmployeeDashboard />,
    //     },
    //   ],
    // },
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
