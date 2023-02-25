import React, { useState } from "react";
import { Box, Text, Button, Image, Center, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import PhoneNumberInput from "./../components/phoneNumberInput";
import { COUNTRIES } from "../components/countries";

import cover from "../images/cover.png";
import OtpInput from "../components/otpInput";

import { auth, appSignIn } from "../../firebase";
import {
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

export default function Login() {
  // const [currentUser, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();
  const countryOptions = COUNTRIES.map(({ name, iso }) => ({
    label: name,
    value: iso,
  }));
  const [value, setValue] = useState("");
  const [otp, updateOtp] = useState("");
  const [final, setfinal] = useState("");
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

  const signIn = async () => {
    setfinal(await appSignIn(value));
    setshow(true);
  };

  const checkOtp = () => {
    if (otp == "" || final == "") {
      return;
    }
    final.confirm(otp).then((result) => {
      navigate("/");
    });
  };
  return (
    <Box
      alignContent={"center"}
      textAlign={"center"}
      maxW={800}
      margin={"auto"}
    >
      <Heading as="h1" size="3xl" mt={30} noOfLines={1}>
        Welcome to MyNinja!
      </Heading>
      <Image maxW={400} m={"auto"} mt={30} src={cover} />
      <br />
      {!show ? (
        <Box>
          <PhoneNumberInput
            value={value}
            options={countryOptions}
            placeholder="Enter phone number"
            onChange={(value) => setValue(value)}
            w="50%"
            m="auto"
          />
          <br />
          <Button
            w={"80%"}
            colorScheme="red"
            id="sign-in-button"
            onClick={signIn}
          >
            Verify
          </Button>
          <br />
        </Box>
      ) : (
        <Box>
          <OtpInput updateOtp={updateOtp} />
          <Button w={"20%"} colorScheme="red" onClick={checkOtp}>
            Verify
          </Button>
        </Box>
      )}
    </Box>
  );
}
