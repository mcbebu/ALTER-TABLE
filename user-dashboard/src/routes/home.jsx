import {
  Box
} from '@chakra-ui/react';

import React, { useState } from "react";
import UserForm from '../components/UserForm'
import Header from '../components/header'
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Home() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const logOut = () => {
    alert('logging out...');
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate("/login")
    }).catch((error) => {
      // An error happened.
      alert(error);
    });
  }

  return (
    <Box w={'full'}>
      <Header currentUser={user} logOut={logOut} />
      <UserForm />
    </Box>
  )
}