import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { user } = useContext(AuthContext);
  // if user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/auth/login" />;
  }
  // if user is logged in, render the child components of the PrivateRoute = sell page
  return <Outlet/>
};

export default PrivateRoute;
