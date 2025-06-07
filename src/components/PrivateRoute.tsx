import { useAuth } from "../logic/authContext";
import { Navigate } from "react-router-dom";
import type { JSX } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
