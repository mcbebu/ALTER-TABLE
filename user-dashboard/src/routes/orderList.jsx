import OrderCard from "../components/ordercard";
import Header from "../components/header";
import {
  Center,
  VStack,
  Text,
  Box,
  SimpleGrid,
  Card,
  CardHeader,
  Kbd,
  CardBody,
  Button,
  HStack,
  Flex,
  Select,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Formik, Field } from "formik";

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

const getUser = async (idToken) => {
  const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return data;
};

const writeData = async ({ pushdata, id, idToken, leaveParcelVal, newuserdata, addrIndex, value }) => {
  let tempData = pushdata;
  tempData.leaveParcel = leaveParcelVal;
  tempData.instructions = pushdata.instructions;
  console.log(value)
  tempData.address = {
    emailAddr: value,
    userAddr1: newuserdata.addresses[addrIndex].userAddr1,
    userAddr2: newuserdata.addresses[addrIndex].userAddr2,
    userAddr3: newuserdata.addresses[addrIndex].userAddr3,
    city: newuserdata.addresses[addrIndex].city,
    postalCode: newuserdata.addresses[addrIndex].postalCode,
  }
  tempData.name = pushdata.name;
  tempData.mobileNumber = pushdata.mobileNumber;
  tempData.leaveParcel = leaveParcelVal;
  const { data } = await axios.put(`${import.meta.env.VITE_SERVER_URL}/order/${id}`, tempData, {
    headers: {
      Authorization: `Bearer ${idToken}`
    }
  })
};

export default function OrderedList() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const { data, isSuccess } = useQuery(
    ["get-order"],
    async () => getOrder(await user.getIdToken()),
    {
      enabled: !!user,
    }
  );
  console.log(data)
  const { data: userdata, isUserSuccess } = useQuery(
    ["get-user"],
    async () => getUser(await user.getIdToken()),
    {
      enabled: !!user,
      onSuccess: () => console.log(userdata),
    }
  );
  const logOut = () => {
    alert("logging out...");
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
        alert(error);
      });
  };

  const OrderCard = (props) => {
    const client = useQueryClient()
    const toast = useToast()
    const { mutate: updateOrder } = useMutation(({ pushdata, id, idToken, leaveParcelVal, newuserdata, addrIndex, value }) => writeData({ pushdata, id, idToken, leaveParcelVal, newuserdata, addrIndex, value }), {
      onSuccess: () => {
        toast({
          title: "Order Updated",
          description: "order updated successfully",
          status: "success",
          isClosable: true,
        })
        client.invalidateQueries({ queryKey: ["get-order"] })
      },
      onError: () => {
        toast({
          title: "Error",
          description: "failed updating order",
          status: "error",
          isClosable: true,
        })
      },
    });
    const mapColor = (status) => {
      const statArr = ["Order created", "Picked up", "On the way", "Delivered"];
      const color = ["gray.100", "blue.100", "yellow.100", "green.100"];
      for (let i = 0; i < 4; i++) if (statArr[i] === status) return color[i];
      return "red.200";
    };
    const [editing, setEditing] = useState(0);
    const [leaveParcelVal, setLeaveParcel] = useState(data.leaveParcel);
    const [addressIndex, setAddressIndex] = useState(0);
    const [email, setEmail] = useState(data[props.index].address.emailAddr)
    // dummyUser.addresses.findIndex((x)=>{return x.userAddr1===data.userAddrs[0];})
    const addressIndexChange = (e) => {
      setAddressIndex(e.target.value);
    };
    const leaveParcelChange = (e) => {
      setLeaveParcel(e.target.value);
    };

    const dummy = [false, false, false, false, false, false, false, false, false, false, false, false]
    const [avail, setAvail] = useState(dummy);

    const [waitingForResponse, setWaiting] = useState(false);

    const idxToTime = (index) => {
      if (index == 0) return '12AM';
      if (index == 6) return '12PM';
      if (index < 6) return index * 2 + 'AM';
      return (index - 6) * 2 + 'PM';
    }

    const changeBool = (idx) => {
      return () => {
        setAvail(prev => prev.map((entry, index) => (
          index === idx ? !entry : entry
        )))
      }
    }

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleRqS = () => {
      onClose();
      setWaiting(true);
    }

    return (
      <>
        {isSuccess && (
          <>
            {data[props.index].status === "On the way" ||
              data[props.index].status === "Delivered" ||
              !editing ? (
              <Card w={data[props.index].status === "On the way" ? 450 : 400} h={"100%"}
                boxShadow={data[props.index].status === "On the way" ? "2xl" : "none"} maxW={400}>
                <CardHeader bg="gray.600">
                  <Center m='auto'>
                    <HStack spacing={10}>
                      <Kbd bg={mapColor(data[props.index].status)}>
                        {data[props.index].status}
                      </Kbd>
                      {data[props.index].status === "On the way" && <HStack fontSize='14px'><VStack><Kbd fontSize='16px'>{data[props.index].estimatedArrivalTime} mins</Kbd><Kbd fontSize='16px'>{data[props.index].stopsUntilDelivery} stops</Kbd></VStack></HStack>}
                      <Box>
                        <Text fontSize="14px" fontWeight="bold" color='white'>
                          Tracking id
                        </Text>
                        <Center><Kbd m={0}>{data[props.index].id}</Kbd></Center>
                      </Box>
                    </HStack>
                  </Center>
                </CardHeader>
                <CardBody>
                  <Center>
                    <Text fontSize="20px" fontWeight="bold">
                      {data[props.index].title}
                    </Text>
                  </Center>
                  <Text fontSize="20px" fontWeight="semibold">
                    Address
                  </Text>
                  <Box ml={6}>{data[props.index].address.userAddr1}</Box>
                  <Box ml={6}>{data[props.index].address.userAddr2}</Box>
                  <Box ml={6}>{data[props.index].address.userAddr3}</Box>
                  <Box ml={6}>{data[props.index].address.city}</Box>
                  <Box ml={6}>{data[props.index].address.postalCode}</Box>
                  <Text fontSize="20px" fontWeight="semibold">
                    Contact Info
                  </Text>
                  <Box ml={6}>{data[props.index].mobileNumber}</Box>
                  <Box ml={6}>{data[props.index].name}</Box>
                  <Box ml={6}>{email}</Box>
                  <Text fontSize="20px" fontWeight="semibold">
                    Delivery Instruction(s)
                  </Text>
                  {data[props.index].instructions && (
                    <>
                      {data[props.index].instructions.map((value, index) => (
                        <Box ml={6}>{value}</Box>
                      ))}
                    </>
                  )}
                  {!data[props.index].instructions && (
                    <>
                      <Box ml={6} fontStyle='italic'>No Instructions</Box>
                    </>
                  )}
                  <Text fontSize="20px" fontWeight="semibold">
                    Leave Parcel
                  </Text>
                  <Box ml={6}>{leaveParcelVal === true ? "Yes" : "No"}</Box>
                </CardBody>
                {!(
                  data[props.index].status === "On the way" ||
                  data[props.index].status === "Delivered"
                ) && (
                    <Button
                      bg='gray.800'
                      color='gray.200'
                      onClick={(e) => {
                        e.preventDefault();
                        setEditing(1);
                      }}
                      type="submit"
                    >
                      Edit Information
                    </Button>
                  )}
                {(data[props.index].status === "On the way" ||
                  data[props.index].status === "Delivered") && (
                    <Box maxW={400}>
                      <Button colorScheme="red" type="submit" onClick={onOpen} w='full'>
                        Cannot Receive Parcel?
                      </Button>
                      <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                          <ModalHeader>Click on your available time to make them green</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            <HStack maxW='none'>
                              {avail.map((entry, index) => (
                                <VStack onClick={changeBool(index)}>
                                  <Text fontSize={'sm'}>{idxToTime(index)}</Text>
                                  {index === 8 ? <Box w={8} h={8} bg='gray' /> : entry ? <Box w={8} h={8} bg={'green'} /> : <Box w={8} h={8} bg={'red'} />}
                                </VStack>
                              ))
                              }
                            </HStack>
                          </ModalBody>
                          <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>
                              Close
                            </Button>
                            <Button colorScheme='red' onClick={handleRqS}>Submit Request</Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    </Box>
                  )}
                {waitingForResponse ? (<Text m='auto'>Waiting for response</Text>) : <></>}
              </Card>
            ) : (
              <Card w={400}>
                <CardHeader>
                  <Center>
                    <Kbd bg={mapColor(data[props.index].status)}>
                      {data[props.index].status}
                    </Kbd>
                  </Center>
                  <Center>
                    <HStack>
                      <Text fontSize="20px" fontWeight="semibold">
                        Tracking id
                      </Text>
                      <Kbd>{data[props.index].id}</Kbd>
                    </HStack>
                  </Center>
                </CardHeader>
                <Flex align="center" justify="center" pt="0em">
                  <Box bg="white" p={6} rounded="md" maxW={400} pt={0}>
                    <Formik
                      initialValues={{
                        name: data[props.index].name,
                        mobileNumber: data[props.index].mobileNumber,
                        userAddr1: data[props.index].address.userAddr1,
                        userAddr2: data[props.index].address.userAddr2,
                        userAddr3: data[props.index].address.userAddr3,
                        city: data[props.index].address.city,
                        postalCode: data[props.index].address.postalCode,
                        instructions: data[props.index].instructions,
                        leaveParcel: data[props.index].leaveParcel,
                        emailAddr: data[props.index].address.emailAddr,
                      }}
                      onSubmit={async (values, actions) => {
                        setEditing(0);
                        // writeData(values);
                        updateOrder({ pushdata: data[props.index], val: values, id: data[props.index].id, idToken: await user.getIdToken(), leaveParcelVal: leaveParcelVal, newuserdata: userdata, addrIndex: addressIndex, value: email })
                        // alert(JSON.stringify(values, null, 2));
                        actions.resetForm();
                      }}
                    >
                      {({ handleSubmit, errors, touched }) => (
                        <form onSubmit={handleSubmit}>
                          <VStack spacing={2} align="flex-start">
                            <Text fontSize="20px" fontWeight="semibold">
                              Address
                            </Text>
                            {userdata.addresses ? (
                              <Select onChange={(e) => addressIndexChange(e)}>
                                {userdata.addresses[0] && (
                                  <option value={0}>
                                    {userdata.addresses[0].userAddr1}, {"  "}
                                    {userdata.addresses[0].userAddr2}, {"  "}
                                    {userdata.addresses[0].userAddr3}
                                  </option>
                                )}
                                {userdata.addresses[1] && (
                                  <option value={1}>
                                    {userdata.addresses[1].userAddr1}, {"  "}
                                    {userdata.addresses[1].userAddr2}, {"  "}
                                    {userdata.addresses[1].userAddr3}
                                  </option>
                                )}
                              </Select>
                            ) : (
                              <Text fontWeight="semibold">
                                You have no default address
                              </Text>
                            )}
                            <FormControl>
                              <Text fontSize="20px" fontWeight="semibold">
                                Contact Info
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
                                value={email}
                                onChange={((e) => setEmail(e.target.value))}
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

  return (
    <>
      {isSuccess && (
        <h1>
          <Header currentUser={user} logOut={logOut} />
          <SimpleGrid
            spacingY={2}
            mt={6}
            columns={{ sm: 1, lg: 2, xl: 3, "2xl": 4 }}
          >
            {data && (
              <>
                {data.map((eachOrder, index) => (
                  <Flex boxShadow={"xl"} m="auto" h="100%">
                    <OrderCard index={index}></OrderCard>
                  </Flex>
                ))}
              </>
            )}
          </SimpleGrid>
        </h1>
      )}
    </>
  );
}
