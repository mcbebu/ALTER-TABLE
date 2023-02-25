import React, { useState } from "react";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function PrivateRoute({ children }) {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  if (!user) {
    navigate("/login");
  }
  return children;
}

export default PrivateRoute;
