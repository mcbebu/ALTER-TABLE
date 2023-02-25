import React, { useState } from "react";
import {
  Box,
  Text,
  Button,
  Image,
} from '@chakra-ui/react';
import PhoneNumberInput from './../components/phoneNumberInput';
import { COUNTRIES } from "../components/countries";

import cover from '../../public/cover.png';

export default function Login() {
  const countryOptions = COUNTRIES.map(({ name, iso }) => ({
    label: name,
    value: iso
  }));
  const [value, setValue] = useState("");

  return (
    <Box alignContent={'center'} textAlign={'center'} maxW={800} margin={'auto'}>
      <Text fontSize='2xl'>Welcome! Please Login</Text>
      <Image maxW={400} m={'auto'} src={cover} /><br />
      <PhoneNumberInput
        value={value}
        options={countryOptions}
        placeholder="Enter phone number"
        onChange={value => setValue(value)}
      /><br />
      <Button w={'80%'} colorScheme="red">Verify</Button>
    </Box >
  )
}