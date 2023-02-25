import {
  Box
} from '@chakra-ui/react';

import React, { useState } from "react";
import UserForm from '../components/UserForm'
import Header from '../components/header'
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [currentUser, setUSer] = useState(auth.currentUser);
  console.log('bruh')
  const logOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate("/login")
    }).catch((error) => {
      // An error happened.
      alert(error);
    });
  }
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      setUSer(currentUser);
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  console.log(currentUser);

  return (
    <Box w={'full'}>
      <Header currentUser={currentUser} logOut={logOut} />
      <UserForm />
    </Box>
  )
}