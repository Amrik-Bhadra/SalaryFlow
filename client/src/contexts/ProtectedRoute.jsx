import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({children}) => {
    const { auth } = useAuth();

    if (!auth || !auth.token) {
      return <Navigate to="/auth/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
