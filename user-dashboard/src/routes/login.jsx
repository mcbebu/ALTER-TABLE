import React, { useState } from "react";
import {
  Box,
  Text,
  Button,
  Image,
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import PhoneNumberInput from './../components/phoneNumberInput';
import { COUNTRIES } from "../components/countries";

import cover from '../images/cover.png';
import OtpInput from "../components/otpInput";

import { auth } from "../../firebase";
import { onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function Login() {

  // const [currentUser, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();
  const countryOptions = COUNTRIES.map(({ name, iso }) => ({
    label: name,
    value: iso
  }));
  const [value, setValue] = useState("");
  const [otp, updateOtp] = useState("");
  const [final, setfinal] = useState('');
  const [show, setshow] = useState(false);

  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     setUser(user);
  //     // ...
  //   } else {
  //     // User is signed out
  //     // ...
  //   }
  // });

  const activateRecaptcha = () => {
    const recaptchaVerifier = new RecaptchaVerifier('recaptcha_container', {}, auth);
    recaptchaVerifier.render();
    signInWithPhoneNumber(auth, value, recaptchaVerifier).then((result) => {
      setfinal(result);
      setshow(true);
    })
      .catch((err) => {
        window.recaptchaVerifier.render().then(function (widgetId) {
          grecaptcha.reset(widgetId);
        });
      });
  }

  const checkOtp = () => {
    if (otp == "" || final == "") {
      return;
    }
    final.confirm(otp).then((result) => {
      navigate("/")
    })
  }
  return (
    <Box alignContent={'center'} textAlign={'center'} maxW={800} margin={'auto'}>
      <Text fontSize='2xl'>Welcome! Please Login</Text>
      <Image maxW={400} m={'auto'} src={cover} /><br />
      {!show
        ? <Box><PhoneNumberInput
          value={value}
          options={countryOptions}
          placeholder="Enter phone number"
          onChange={value => setValue(value)}
        /><br />
          <div id="recaptcha_container"></div>
          <Button w={'80%'} colorScheme="red" onClick={activateRecaptcha}>Verify</Button><br /></Box>
        : <Box><OtpInput
          updateOtp={updateOtp}
        />
          <Button w={'80%'} colorScheme="red" onClick={checkOtp}>Verify</Button></Box>
      }
    </Box >
  )
}