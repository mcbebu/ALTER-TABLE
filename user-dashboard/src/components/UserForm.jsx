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

const getUserData = async (idToken) => {
  const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user`, {
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  })
  return data
}


export default function UserForm() {

  const [selectedAddress, setAddress] = useState(0);
  const [user] = useAuthState(auth);
  // const { data, isSuccess } = useQuery(['user'], async () => getUserData(await user.getIdToken()), {
  //   enabled: !!user
  // })
  // console.log("user ", JSON.stringify(user))
  // console.log("read ", JSON.stringify(data));

  const addresses = [
    {
      id: '01273048120',
      name: 'Puri Virakarn',
      title: "parcel name",
      userAddrs: ["Addr1", "Addr2", "Addr3", "city", "postalCode"],
      instructions: ["Leave Parcel at the door"],
      leaveParcel: true,
      status: "On the way",
      mobileNumber: '123446',
      emailAddr: "adsfljas@opijpo.co.sg",
    },
    {
      id: '01273048120',
      name: 'Puri Virakarn',
      title: "parcel name",
      userAddrs: ["Addr12", "Addr22", "Addr32", "city", "postalCode"],
      instructions: ["Leave Parcel at the door"],
      leaveParcel: true,
      status: "On the way",
      mobileNumber: '123446',
      emailAddr: "adsfljas@opijpo.co.sg",
    }
  ]

  const [userAddresses, updateAddress] = useState(addresses);

  useEffect(() => {
    // Update the document title using the browser API
    console.log(userAddresses);
  });

  const convertValue = (value) => {
    let tmp = [];
    let idx = 0;
    console.log(value);
    while (value['userAddr1_' + (idx + 1)]) {
      console.log('yep ' + idx);
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

  const initialV = {};
  addresses.forEach((address, index) => {
    initialV['userAddr1_' + (index + 1)] = address.userAddrs[0];
    initialV['userAddr2_' + (index + 1)] = address.userAddrs[1];
    initialV['userAddr3_' + (index + 1)] = address.userAddrs[2];
    initialV['city_' + (index + 1)] = address.userAddrs[3];
    initialV['postalCode_' + (index + 1)] = address.userAddrs[4];
    initialV['phoneNumber_' + (index + 1)] = address.mobileNumber;
    initialV['email_' + (index + 1)] = address.emailAddr;
  });

  return (
    <Flex align="center" justify="center" pt='0em'>
      <Box bg="white" p={6} rounded="md" w={'60%'}>
        <Text fontSize={'3xl'} as={'b'} mb={4}>Preferences</Text>
        <Formik
          initialValues={initialV}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              updateAddress(convertValue(values));
              actions.setSubmitting(false);
            }, 1000);
          }}
        >
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
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
                  addresses.map((address, index) => (
                    <option value={index + 1}>{'Address ' + (index + 1)}</option>
                  ))
                }
              </Select>
              <VStack spacing={4} align="flex-start">
                {
                  addresses.map((address, index) => (
                    selectedAddress == index + 1
                      ? <VStack spacing={4} align="flex-start" w={'full'} id={'Address' + (index + 1)}>
                        <Text fontSize={'xl'} as={'b'}>{'Address ' + (index + 1)}</Text>
                        <FormControl isInvalid={!!errors.password && touched.password}>
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
                        <FormControl isInvalid={!!errors.password && touched.password}>
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
                        <FormControl isInvalid={!!errors.password && touched.password}>
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
                              <FormErrorMessage>{errors.password}</FormErrorMessage>
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
                {/* {selectedAddress == 1 && <VStack spacing={4} align="flex-start" w={'full'} id='Address1'>
                  <Text fontSize={'xl'} as={'b'}>Address 1</Text>
                  <FormControl isInvalid={!!errors.password && touched.password}>
                    <FormLabel htmlFor="userAddr1">Address Line 1</FormLabel>
                    <Field
                      as={Input}
                      id="userAddr1"
                      name="userAddr1"
                      type="userAddr1"
                      variant="filled"
                      placeholder="Address Line 1"

                    />
                  </FormControl>
                  <FormControl isInvalid={!!errors.password && touched.password}>
                    <FormLabel htmlFor="userAddr2">Address Line 2</FormLabel>
                    <Field
                      as={Input}
                      id="userAddr2"
                      name="userAddr2"
                      type="userAddr2"
                      variant="filled"
                      placeholder="Address Line 2"

                    />
                  </FormControl>
                  <FormControl isInvalid={!!errors.password && touched.password}>
                    <FormLabel htmlFor="userAddr3">Address Line 3</FormLabel>
                    <Field
                      as={Input}
                      id="userAddr3"
                      name="userAddr3"
                      type="userAddr3"
                      variant="filled"
                      placeholder="Address Line 3"

                    />
                  </FormControl>
                  <Grid templateColumns='repeat(2, 1fr)' w={'full'} gap={4}>
                    <GridItem>
                      <FormControl>
                        <FormLabel htmlFor="city">City</FormLabel>
                        <Field
                          as={Input}
                          id="city"
                          name="city"
                          type="city"
                          variant="filled"
                          placeholder="City"

                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel htmlFor="postalCode">Postal Code</FormLabel>
                        <Field
                          as={Input}
                          id="postalCode"
                          name="postalCode"
                          type="postalCode"
                          variant="filled"
                          placeholder="Postal Code"

                        />
                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                        <Field
                          as={Input}
                          id="phoneNumber"
                          name="phoneNumber"
                          type="phoneNumber"
                          variant="filled"
                          placeholder="Phone"
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel htmlFor="name">Email</FormLabel>
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          variant="filled"
                          placeholder="John.Doe@example.com"
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                </VStack>}
                {selectedAddress == 2 && <VStack spacing={4} align="flex-start" w={'full'}>
                  <Text fontSize={'xl'} as={'b'}>Address 2</Text>
                  <FormControl isInvalid={!!errors.password && touched.password}>
                    <FormLabel htmlFor="userAddr1">Address Line 1</FormLabel>
                    <Field
                      as={Input}
                      id="userAddr1"
                      name="userAddr1"
                      type="userAddr1"
                      variant="filled"
                      placeholder="Address Line 1"
                    />
                  </FormControl>
                  <FormControl isInvalid={!!errors.password && touched.password}>
                    <FormLabel htmlFor="userAddr2">Address Line 2</FormLabel>
                    <Field
                      as={Input}
                      id="userAddr2"
                      name="userAddr2"
                      type="userAddr2"
                      variant="filled"
                      placeholder="Address Line 2"

                    />
                  </FormControl>
                  <FormControl isInvalid={!!errors.password && touched.password}>
                    <FormLabel htmlFor="userAddr3">Address Line 3</FormLabel>
                    <Field
                      as={Input}
                      id="userAddr3"
                      name="userAddr3"
                      type="userAddr3"
                      variant="filled"
                      placeholder="Address Line 3"

                    />
                  </FormControl>
                  <Grid templateColumns='repeat(2, 1fr)' w={'full'} gap={4}>
                    <GridItem>
                      <FormControl>
                        <FormLabel htmlFor="city">City</FormLabel>
                        <Field
                          as={Input}
                          id="city"
                          name="city"
                          type="city"
                          variant="filled"
                          placeholder="City"

                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel htmlFor="postalCode">Postal Code</FormLabel>
                        <Field
                          as={Input}
                          id="postalCode"
                          name="postalCode"
                          type="postalCode"
                          variant="filled"
                          placeholder="Postal Code"

                        />
                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                        <Field
                          as={Input}
                          id="phoneNumber"
                          name="phoneNumber"
                          type="phoneNumber"
                          variant="filled"
                          placeholder="Phone"
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel htmlFor="name">Email</FormLabel>
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          variant="filled"
                          placeholder="John.Doe@example.com"
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                </VStack>} */}
                {/* <VStack spacing={4} align="flex-start" w={'full'}>
                  <Text fontSize={'xl'} as={'b'}>Shipping Time</Text>
                  <TableContainer
                    sx={{
                      'margin': 'auto'
                    }}
                  >
                    <Table
                      variant='simple'
                      size={'sm'}
                      sx={{
                        Td: {
                          'border': '1px solid',
                          'borderCollapse': 'collapse'
                        },
                        Th: {
                          'border': '1px solid',
                          'borderCollapse': 'collapse'
                        }
                      }}>
                      <Thead>
                        <Tr>
                          <Th>Time</Th>
                          <Th>Sunday</Th>
                          <Th>Monday</Th>
                          <Th>Tuesday</Th>
                          <Th>Wednesday</Th>
                          <Th>Thursday</Th>
                          <Th>Friday</Th>
                          <Th>Saturday</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {
                          filteredData.map((eachTime, index) => (
                            <Tr>
                              <Td>{idxToTime(index)}</Td>
                              {eachTime.map((item, day) => (
                                <Td backgroundColor={'#68D391'} />
                              ))}
                            </Tr>
                          ))
                        }
                      </Tbody>
                    </Table>
                  </TableContainer>
                </VStack> */}
                <VStack spacing={4} align="flex-start" w={'full'}>
                  <Text fontSize={'xl'} as={'b'}>Notifications</Text>
                  <FormControl as='fieldset'>
                    <FormLabel as='legend'>Notify before delivery (Always notify 10 minutes before and on delivery)</FormLabel>
                    <HStack spacing='24px'>
                      <Checkbox isDisabled defaultChecked>10 minutes</Checkbox>
                      <Checkbox>20 minutes</Checkbox>
                      <Checkbox>30 minutes</Checkbox>
                      <Checkbox>40 minutes</Checkbox>
                      <Checkbox>50 minutes</Checkbox>
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