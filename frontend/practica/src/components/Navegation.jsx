import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import Blog from "../pages/Blog/Blog";
import Product from "../pages/Products/Products";
import Branches from "../pages/Branches/Branches";
import PrivateRoute from "./PrivateRoute";
import SideNav from "./SideNav/SideNav";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

function Navegation() {
  const { authCokie } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authCokie && location.pathname === "/") {
      navigate("/blog", { replace: true });
    }
  }, [authCokie, navigate, location.pathname]);

  return (
    <>
      {authCokie && <SideNav />}
      <div className={`app-container ${authCokie ? 'with-sidebar' : ''}`}>
        <Routes>
          {!authCokie && <Route path="/" element={<Login />} />}
          {authCokie && <Route path="/" element={<Navigate to="/blog" replace />} />}
          <Route element={<PrivateRoute />}>
            <Route path="/blog" element={<Blog />} />
            <Route path="/products" element={<Product />} />
            <Route path="/branches" element={<Branches />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default Navegation;