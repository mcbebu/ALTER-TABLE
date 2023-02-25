import React, { useState } from "react";
import { Navigate, redirect, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

function PrivateRoute({ children }) {
  const navigate = useNavigate();
  const [currentUser, setUSer] = useState(auth.currentUser);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUSer(currentUser);
      console.log(children);
      return children;
    } else {
      console.log(children);
      navigate('/login');
    }
  });
  if (currentUser == null || !currentUser) {
    navigate('login');
  }
  return children;
}

export default PrivateRoute;