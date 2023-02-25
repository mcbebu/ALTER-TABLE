import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Text,
  Kbd,
  VStack,
  HStack,
  Center,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Formik, Field } from "formik";
import { auth } from "../../firebase";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const mapColor = (status) => {
  const statArr = ["Order created", "Picked up", "On the way", "Delivered"];
  const color = ["gray.100", "blue.100", "yellow.100", "green.100"];
  for (let i = 0; i < 4; i++) if (statArr[i] === status) return color[i];
  return "red.200";
};

const getOrder = async (idToken) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_SERVER_URL}/orders`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return data;
};

const OrderCard = (props) => {
  const [user] = useAuthState(auth);

  const [editing, setEditing] = useState(0);
  const [leaveParcelVal, setLeaveParcel] = useState(props.data.leaveParcel);
  const [addressIndex, setAddressIndex] = useState(
    props.userData.addresses.findIndex((x) => {
      return x.userAddr1 === props.data.userAddrs[0];
    })
  );
  console.log(props.ogdata, props.isSuccess);
  const addressIndexChange = (e) => {
    setAddressIndex(e.target.value);
  };
  const leaveParcelChange = (e) => {
    setLeaveParcel(e.target.value);
  };
  const writeData = (val) => {
    let tempData = props.alldata;
    const addr = [
      props.userData.addresses[addressIndex].userAddr1,
      props.userData.addresses[addressIndex].userAddr2,
      props.userData.addresses[addressIndex].userAddr3,
      props.userData.addresses[addressIndex].city,
      props.userData.addresses[addressIndex].postalCode,
    ];
    tempData[props.index].userAddrs = addr;
    tempData[props.index].name = val.name;
    tempData[props.index].emailAddr = val.emailAddr;
    tempData[props.index].mobileNumber = val.mobileNumber;
    tempData[props.index].instructions = [val.instructions];
    tempData[props.index].leaveParcel = leaveParcelVal;
    props.setData(tempData);
  };
  return (
    <>
      {isSuccess && (
        <>
          {props.data.status === "On the way" ||
          props.data.status === "Delivered" ||
          !editing ? (
            <Card w={300}>
              <CardHeader bg="gray.300">
                <Center>
                  <Kbd bg={mapColor(props.data.status)}>
                    {props.data.status}
                  </Kbd>
                </Center>
                <Center>
                  <VStack>
                    <Text fontSize="20px" fontWeight="semibold">
                      Tracking id
                    </Text>
                    <Kbd m={0}>{props.data.id}</Kbd>
                    <br />
                  </VStack>
                </Center>
                <Center>
                  <Text fontSize="20px" fontWeight="bold">
                    {props.data.title}
                  </Text>
                </Center>
              </CardHeader>
              <CardBody>
                <Text fontSize="20px" fontWeight="semibold">
                  Address
                </Text>
                <Box ml={6}>
                  {props.userData.addresses[addressIndex].userAddr1}
                </Box>
                <Box ml={6}>
                  {props.userData.addresses[addressIndex].userAddr2}
                </Box>
                <Box ml={6}>
                  {props.userData.addresses[addressIndex].userAddr3}
                </Box>
                <Box ml={6}>{props.userData.addresses[addressIndex].city}</Box>
                <Box ml={6}>
                  {props.userData.addresses[addressIndex].postalCode}
                </Box>
                <Text fontSize="20px" fontWeight="semibold">
                  Contact Info
                </Text>
                <Box ml={6}>{props.data.mobileNumber}</Box>
                <Box ml={6}>{props.data.name}</Box>
                <Box ml={6}>{props.data.emailAddr}</Box>
                <Text fontSize="20px" fontWeight="semibold">
                  Delivery Instruction(s)
                </Text>
                {props.data.instructions.map((value, index) => (
                  <Box ml={6}>{value}</Box>
                ))}
                <Text fontSize="20px" fontWeight="semibold">
                  Leave Parcel
                </Text>
                <Box ml={6}>{leaveParcelVal === true ? "Yes" : "No"}</Box>
              </CardBody>
              {!(
                props.data.status === "On the way" ||
                props.data.status === "Delivered"
              ) && (
                <Button
                  colorScheme="blue"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditing(1);
                  }}
                  type="submit"
                >
                  Edit Information
                </Button>
              )}
              {(props.data.status === "On the way" ||
                props.data.status === "Delivered") && (
                <Popover>
                  <PopoverTrigger>
                    <Button colorScheme="blue" type="submit">
                      Edit Information
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader> Cannot Edit Information</PopoverHeader>
                    <PopoverBody>The parcel is already on the way.</PopoverBody>
                  </PopoverContent>
                </Popover>
              )}
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <Center>
                  <Kbd bg={mapColor(props.data.status)}>
                    {props.data.status}
                  </Kbd>
                </Center>
                <Center>
                  <HStack>
                    <Text fontSize="20px" fontWeight="semibold">
                      Tracking id
                    </Text>
                    <Kbd>{props.data.id}</Kbd>
                  </HStack>
                </Center>
              </CardHeader>
              <Flex align="center" justify="center" pt="0em">
                <Box bg="white" p={6} rounded="md" maxW={400} pt={0}>
                  <Formik
                    initialValues={{
                      name: props.data.name,
                      mobileNumber: props.data.mobileNumber,
                      userAddr1: props.data.userAddrs[0],
                      userAddr2: props.data.userAddrs[1],
                      userAddr3: props.data.userAddrs[2],
                      city: props.data.userAddrs[3],
                      postalCode: props.data.userAddrs[4],
                      instructions: props.data.instructions,
                      leaveParcel: props.data.leaveParcel,
                      emailAddr: props.data.emailAddr,
                    }}
                    onSubmit={(values) => {
                      setEditing(0);
                      writeData(values);
                      alert(JSON.stringify(values, null, 2));
                    }}
                  >
                    {({ handleSubmit, errors, touched }) => (
                      <form onSubmit={handleSubmit}>
                        <VStack spacing={2} align="flex-start">
                          <Text fontSize="20px" fontWeight="semibold">
                            Address
                          </Text>
                          <Select onChange={(e) => addressIndexChange(e)}>
                            {props.userData.addresses[0] && (
                              <option value={0}>
                                {props.userData.addresses[0].userAddr1}, {"  "}
                                {props.userData.addresses[0].userAddr2}, {"  "}
                                {props.userData.addresses[0].userAddr3}
                              </option>
                            )}
                            {props.userData.addresses[1] && (
                              <option value={1}>
                                {props.userData.addresses[1].userAddr1}, {"  "}
                                {props.userData.addresses[1].userAddr2}, {"  "}
                                {props.userData.addresses[1].userAddr3}
                              </option>
                            )}
                          </Select>
                          <FormControl>
                            <Text fontSize="20px" fontWeight="semibold">
                              Recipient's
                            </Text>
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <Field
                              as={Input}
                              id="name"
                              name="name"
                              type="name"
                              variant="filled"
                              placeholder="John Doe"
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel htmlFor="mobileNumber">
                              Mobile Number
                            </FormLabel>
                            <Field
                              as={Input}
                              id="mobileNumber"
                              name="mobileNumber"
                              type="mobileNumber"
                              variant="filled"
                              placeholder="John Doe"
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel htmlFor="emailAddr">
                              Email Address
                            </FormLabel>
                            <Field
                              as={Input}
                              id="emailAddr"
                              name="emailAddr"
                              type="emailAddr"
                              variant="filled"
                              placeholder="John Doe"
                            />
                          </FormControl>
                          <FormControl>
                            <Text fontSize="20px" fontWeight="semibold">
                              Delivery Instructions
                            </Text>
                            <FormLabel htmlFor="instructions"></FormLabel>
                            <Field
                              as={Input}
                              id="instructions"
                              name="instructions"
                              type="instructions"
                              variant="filled"
                            />
                          </FormControl>
                          <Text fontSize="20px" fontWeight="semibold">
                            Leave Parcel
                          </Text>
                          <Select onChange={(e) => leaveParcelChange(e)}>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </Select>
                          <Button
                            type="submit"
                            colorScheme="purple"
                            float={"left"}
                          >
                            Update Changes
                          </Button>
                        </VStack>
                      </form>
                    )}
                  </Formik>
                  <Button
                    mt={2}
                    type="submit"
                    colorScheme="red"
                    float={"left"}
                    onClick={(e) => {
                      e.preventDefault();
                      setEditing(0);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Flex>
            </Card>
          )}
        </>
      )}
    </>
  );
};

export default OrderCard;
