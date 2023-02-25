import react, { useState, useEffect } from 'react';
import { Formik, Field } from "formik";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  HStack,
  Text,
  ButtonGroup,
  Grid,
  GridItem,
  Select,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";
import axios from "axios";

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase'
import { useQuery } from '@tanstack/react-query'
import { onAuthStateChanged } from 'firebase/auth';

const getUserData = async (idToken) => {
  const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user`, {
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  return data;
}


export default function UserForm() {

  // const d = (x) => {
  //   console.log(x);
  //   return x;
  // }

  const [selectedAddress, setAddress] = useState(0);
  const [user] = useAuthState(auth);
  const { data, isSuccess } = useQuery(['user'], async () => getUserData(await user.getIdToken()), {
    enabled: !!user
  })
  console.log("user ", JSON.stringify(user))
  console.log("read ", JSON.stringify(data));

  let addresses = [];
  try {
    data.map((val, index) => {
      addresses.push(val);
    })
  }
  catch (e) {
    addresses.push(data);
  }
  const [userAddresses, updateAddress] = useState(addresses);
  if (userAddresses.length > addresses.length) {
    addresses.push(userAddresses[addresses.length]);
  }

  useEffect(() => {
    // Update the document title using the browser API
    console.log(userAddresses);
  });

  const convertValue = (value) => {
    let tmp = [];
    let idx = 0;
    while (value['userAddr1_' + (idx + 1)]) {
      let obj = {};
      obj.id = addresses[idx].id;
      obj.name = addresses[idx].name;
      obj.title = addresses[idx].title;
      obj.instructions = addresses[idx].instructions;
      obj.leavePArcel = addresses[idx].leaveParcel;
      obj.status = addresses[idx].status;
      obj.mobileNumber = value['phoneNumber_' + (idx + 1)];
      obj.emailAddr = value['email_' + (idx + 1)];
      obj.userAddrs = [value['userAddr1_' + (idx + 1)], value['userAddr2_' + (idx + 1)], value['userAddr3_' + (idx + 1)], value['city_' + (idx + 1)], value['postalCode_' + (idx + 1)]];
      tmp.push(obj);
      idx++;
    }
    return tmp;
  }

  const getInitials = () => {
    const initialV = {};
    initialV.notifications = [];
    addresses.forEach((address, index) => {
      address?.notifications?.map((entry, index) => {
        initialV.notifications.push(entry);
      })
      if (address && !address.userAddrs) {
        initialV['userAddr1_' + (index + 1)] = "";
        initialV['userAddr2_' + (index + 1)] = "";
        initialV['userAddr3_' + (index + 1)] = "";
        initialV['city_' + (index + 1)] = "";
        initialV['postalCode_' + (index + 1)] = "";
        initialV['phoneNumber_' + (index + 1)] = "";
        initialV['email_' + (index + 1)] = "";
      }
      if (address?.userAddrs) initialV['userAddr1_' + (index + 1)] = address.userAddrs[0];
      else initialV['userAddr1_' + (index + 1)] = "";
      if (address?.userAddrs && address.userAddrs[1]) initialV['userAddr2_' + (index + 1)] = address.userAddrs[1];
      else initialV['userAddr2_' + (index + 1)] = "";
      if (address?.userAddrs && address.userAddrs[2]) initialV['userAddr3_' + (index + 1)] = address.userAddrs[2];
      else initialV['userAddr3_' + (index + 1)] = "";
      if (address?.userAddrs && address.userAddrs[3]) initialV['city_' + (index + 1)] = address.userAddrs[3];
      else initialV['city_' + (index + 1)] = "";
      if (address?.userAddrs && address.userAddrs[4]) initialV['postalCode_' + (index + 1)] = address.userAddrs[4];
      else initialV['postalCode_' + (index + 1)] = "";
      if (address?.mobileNumber) initialV['phoneNumber_' + (index + 1)] = address.mobileNumber;
      else initialV['phoneNumber_' + (index + 1)] = "";
      if (address?.emailAddr) initialV['email_' + (index + 1)] = address.emailAddr;
      else initialV['email_' + (index + 1)] = "";
    });
    return initialV;
  }

  const addAddress = () => {
    addresses.push({
      id: addresses[0].id,
      name: addresses[0].name,
      title: addresses[0].title,
      instructions: addresses[0].instructions,
      leavePArcel: addresses[0].leaveParcel,
      status: addresses[0].status,
      mobileNumber: addresses[0].mobileNumber,
      emailAddr: addresses[0].emailAddr,
    })
    console.log(addresses);
    updateAddress(addresses);
  }

  return (
    <Flex align="center" justify="center" pt='0em'>
      <Box bg="white" p={6} rounded="md" w={'60%'}>
        <Text fontSize={'3xl'} as={'b'} mb={4}>Preferences</Text>
        <Formik
          initialValues={getInitials()}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              updateAddress(convertValue(values));
              actions.setSubmitting(false);
            }, 1000);
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Flex gap={4}>
                <Select
                  placeholder='Select Address'
                  onChange={(e) => {
                    setAddress(e.target.value ? e.target.value : 0)
                  }}
                  sx={{
                    'marginTop': 4,
                    'marginBottom': 4
                  }}
                >
                  {
                    userAddresses.map((address, index) => (
                      <option value={index + 1}>{'Address ' + (index + 1)}</option>
                    ))
                  }
                </Select>
                <Button m={'auto'} colorScheme='red' onClick={addAddress}>Add Address</Button>
              </Flex>
              <VStack spacing={4} align="flex-start">
                {
                  userAddresses.map((address, index) => (
                    selectedAddress == index + 1
                      ? <VStack spacing={4} align="flex-start" w={'full'} id={'Address' + (index + 1)}>
                        <Text fontSize={'xl'} as={'b'}>{'Address ' + (index + 1)}</Text>
                        <FormControl isInvalid={!!props.errors.password && touched.password}>
                          <FormLabel htmlFor={"userAddr1_" + (index + 1)}>Address Line 1</FormLabel>
                          <Field
                            as={Input}
                            id={"userAddr1_" + (index + 1)}
                            name={"userAddr1_" + (index + 1)}
                            type={"userAddr1_" + (index + 1)}
                            variant="filled"
                            placeholder="Address Line 1"
                          />
                        </FormControl>
                        <FormControl isInvalid={!!props.errors.password && touched.password}>
                          <FormLabel htmlFor={"userAddr2_" + (index + 1)}>Address Line 2</FormLabel>
                          <Field
                            as={Input}
                            id={"userAddr2_" + (index + 1)}
                            name={"userAddr2_" + (index + 1)}
                            type={"userAddr2_" + (index + 1)}
                            variant="filled"
                            placeholder="Address Line 2"
                          />
                        </FormControl>
                        <FormControl isInvalid={!!props.errors.password && touched.password}>
                          <FormLabel htmlFor={"userAddr3_" + (index + 1)}>Address Line 3</FormLabel>
                          <Field
                            as={Input}
                            id={"userAddr3_" + (index + 1)}
                            name={"userAddr3_" + (index + 1)}
                            type={"userAddr3_" + (index + 1)}
                            variant="filled"
                            placeholder="Address Line 3"
                          />
                        </FormControl>
                        <Grid templateColumns='repeat(2, 1fr)' w={'full'} gap={4}>
                          <GridItem>
                            <FormControl>
                              <FormLabel htmlFor={"city_" + (index + 1)}>City</FormLabel>
                              <Field
                                as={Input}
                                id={"city_" + (index + 1)}
                                name={"city_" + (index + 1)}
                                type={"city_" + (index + 1)}
                                variant="filled"
                                placeholder="City"
                              />
                            </FormControl>
                          </GridItem>
                          <GridItem>
                            <FormControl>
                              <FormLabel htmlFor={"postalCode_" + (index + 1)}>Postal Code</FormLabel>
                              <Field
                                as={Input}
                                id={"postalCode_" + (index + 1)}
                                name={"postalCode_" + (index + 1)}
                                type={"postalCode_" + (index + 1)}
                                variant="filled"
                                placeholder="Postal Code"

                              />
                              <FormErrorMessage>{props.errors.password}</FormErrorMessage>
                            </FormControl>
                          </GridItem>
                          <GridItem>
                            <FormControl>
                              <FormLabel htmlFor={"phoneNumber" + (index + 1)}>Phone Number</FormLabel>
                              <Field
                                as={Input}
                                id={"phoneNumber" + (index + 1)}
                                name={"phoneNumber" + (index + 1)}
                                type={"phoneNumber" + (index + 1)}
                                variant="filled"
                                placeholder="Phone"
                              />
                            </FormControl>
                          </GridItem>
                          <GridItem>
                            <FormControl>
                              <FormLabel htmlFor={"email" + (index + 1)}>Email</FormLabel>
                              <Field
                                as={Input}
                                id={"email" + (index + 1)}
                                name={"email" + (index + 1)}
                                type={"email" + (index + 1)}
                                variant="filled"
                                placeholder="John.Doe@example.com"
                              />
                            </FormControl>
                          </GridItem>
                        </Grid>
                      </VStack>
                      : <></>
                  ))
                }
                <VStack spacing={4} align="flex-start" w={'full'}>
                  <Text fontSize={'xl'} as={'b'}>Notifications</Text>
                  <FormControl as='fieldset'>
                    <FormLabel as='legend'>Notify before delivery (Always notify 10 minutes before and on delivery)</FormLabel>
                    <HStack spacing='24px'>
                      <Checkbox isDisabled defaultChecked>10 minutes</Checkbox>
                      <Checkbox defaultChecked={props.initialValues.notifications[0]}>20 minutes</Checkbox>
                      <Checkbox defaultChecked={props.initialValues.notifications[1]}>30 minutes</Checkbox>
                      <Checkbox defaultChecked={props.initialValues.notifications[2]}>40 minutes</Checkbox>
                      <Checkbox defaultChecked={props.initialValues.notifications[3]}>50 minutes</Checkbox>
                    </HStack>
                  </FormControl>
                </VStack>
                <ButtonGroup gap='4' justifyContent={'flex-end'} w={'full'}>
                  <Button type="reset" colorScheme="gray">
                    Cancel
                  </Button>
                  <Button type="submit" colorScheme="red">
                    Save Changes
                  </Button>
                </ButtonGroup>
              </VStack>
            </form>
          )}
        </Formik>
      </Box>
    </Flex >
  );
}