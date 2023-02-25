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

  const [user] = useAuthState(auth);
  const { data, isSuccess } = useQuery(['user'], async () => getUserData(await user.getIdToken()), {
    enabled: !!user
  })
  console.log("user ", JSON.stringify(user))
  console.log("read ", JSON.stringify(data));

  const [selectedAddress, setAddress] = useState(0);

  if (data && !data?.addresses) {
    data.addresses = [];
  }

  const updateAddress = () => {
    alert("congrats! write update now");
    console.log(data.addresses);
  }

  const convertValue = (value) => {
    let idx = 0;
    while (value['userAddr1_' + (idx + 1)] && value['email_' + (idx + 1)] && value['city_' + (idx + 1)] && value['postalCode_' + (idx + 1)]) {
      data.addresses[idx].EmailAddr = value['email_' + (idx + 1)];
      data.addresses[idx].UserAddr1 = value['userAddr1_' + (idx + 1)];
      if (value['userAddr2_' + (idx + 1)]) data.addresses[idx].UserAddr2 = value['userAddr2_' + (idx + 1)];
      if (value['userAddr3_' + (idx + 1)]) data.addresses[idx].UserAddr3 = value['userAddr3_' + (idx + 1)];
      data.addresses[idx].City = value['city_' + (idx + 1)];
      data.addresses[idx].PostalCode = value['postalCode_' + (idx + 1)];
      idx++;
    }
  }

  const getInitials = () => {
    const initialV = {};
    data?.addresses?.forEach((address, index) => {
      initialV['email_' + (index + 1)] = address.EmailAddr;
      initialV['userAddr1_' + (index + 1)] = address.UserAddr1;
      initialV['userAddr2_' + (index + 1)] = address.UserAddr2 ? address.UserAddr2 : "";
      initialV['userAddr3_' + (index + 1)] = address.UserAddr3 ? address.UserAddr3 : "";
      initialV['city_' + (index + 1)] = address.City;
      initialV['postalCode_' + (index + 1)] = address.PostalCode;
    })
    return initialV;
  }

  const addAddress = () => {
    data.addresses.push({
      emailAddr: "",
      UserAddr1: "",
      UserAddr2: "",
      UserAddr3: "",
      City: "",
      PostalCode: "",
    });
    setAddress(data.addresses.length);
  }

  const changeNoti = (hash) => {
    console.log(hash);
    data.notifications[0] = hash.includes('0');
    data.notifications[1] = hash.includes('1');
    data.notifications[2] = hash.includes('2');
    data.notifications[3] = hash.includes('3');
    console.log(data.notifications);
  }

  const defaultNoti = () => {
    const tmp = [];
    if (data?.notifications[0]) tmp.push('0');
    if (data?.notifications[1]) tmp.push('1');
    if (data?.notifications[2]) tmp.push('2');
    if (data?.notifications[3]) tmp.push('3');
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
              convertValue(values);
              updateAddress();
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
                    data?.addresses.map((address, index) => (
                      <option value={index + 1}>{'Address ' + (index + 1)}</option>
                    ))
                  }
                </Select>
                <Button m={'auto'} colorScheme='red' onClick={addAddress} >Add Address</Button>
              </Flex>
              <VStack spacing={4} align="flex-start">
                {
                  data?.addresses.map((address, index) => (
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
                          <GridItem colSpan={2}>
                            <FormControl>
                              <FormLabel htmlFor={"email_" + (index + 1)}>Email</FormLabel>
                              <Field
                                as={Input}
                                id={"email_" + (index + 1)}
                                name={"email_" + (index + 1)}
                                type={"email_" + (index + 1)}
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
                    <CheckboxGroup colorScheme='green' onChange={changeNoti} defaultValue={defaultNoti()}>
                      <HStack spacing='24px'>
                        <Checkbox isDisabled defaultChecked>10 minutes</Checkbox>
                        <Checkbox value={'0'}>20 minutes</Checkbox>
                        <Checkbox value={'1'}>30 minutes</Checkbox>
                        <Checkbox value={'2'}>40 minutes</Checkbox>
                        <Checkbox value={'3'}>50 minutes</Checkbox>
                      </HStack>
                    </CheckboxGroup>
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