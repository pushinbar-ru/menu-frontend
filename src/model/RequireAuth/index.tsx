import React from "react";
// TODO: import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";

interface RequireAuthProps {
  children: React.ReactElement;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  // TODO: const { isAuth } = useSelector((state) => state.auth);
  const authCheck = localStorage.getItem("masterKey") === "ХОЧУ ПИВО";
  const location = useLocation();

  // TODO: if (!isAuth) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }
  const loginPath = "/admin/login";

  if (!authCheck) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
