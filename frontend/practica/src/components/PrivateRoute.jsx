import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { authCokie } = useAuth();
  return authCokie ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;