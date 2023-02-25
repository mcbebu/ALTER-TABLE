import React, { useState, useEffect } from "react";
import { PinInput, PinInputField, Box, Text } from "@chakra-ui/react";

export default function OtpInput(props) {
  return (
    <Box m={8}>
      <Text fontSize={"lg"}>Enter OTP sent to your phone</Text>
      <PinInput otp type="number" onComplete={(otp) => props.updateOtp(otp)}>
        <PinInputField />
        <PinInputField />
        <PinInputField />
        <PinInputField />
        <PinInputField />
        <PinInputField />
      </PinInput>
    </Box>
  );
}
