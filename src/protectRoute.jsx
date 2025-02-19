import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (!user) {
    return children;
  }

  return null;
};

export default ProtectedRoute;
