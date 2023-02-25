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
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";
import axios from "axios";

import {useAuthState} from 'react-firebase-hooks/auth'
import { auth } from '../../firebase'
import {useQuery} from '@tanstack/react-query'

const getUserData = async (idToken) => {
  const {data} = await axios.get(`${import.meta.env.VITE_SERVER_URL}/hello`, {
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  })
  return data
}

export default function UserForm() {
  const [user] = useAuthState(auth);
  const {data, isSuccess} = useQuery(['user'], async () => getUserData(await user.getIdToken()), {
    enabled: !!user
  })
  console.log("read ", JSON.stringify(user));
  const idxToTime = (index) => {
    if (index == 0) {
      return '12AM';
    }
    if (index == 12) {
      return '12PM';
    }
    if (index < 12) {
      return index + 'AM';
    }
    return (index - 12) + 'PM';
  }

  const dummyData = [
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
  ]
  const filteredData = dummyData[0].map((_, colIndex) => dummyData.map(row => row[colIndex]));

  return (
    <Flex align="center" justify="center" pt='0em'>
      <Box bg="white" p={6} rounded="md" w={'60%'}>
        <Text fontSize={'3xl'} as={'b'} mb={4}>Preferences</Text>
        <Formik
          initialValues={{
            name: "bruh",
            userAddr1: "",
            userAddr2: "",
            userAddr3: "",
            city: "",
            postalCode: "",
            mobileNumber: "",
            title: "",
          }}
          onSubmit={(values) => {
            alert(JSON.stringify(values, null, 2));
          }}
        >
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <VStack spacing={4} align="flex-start" w={'full'}>
                  <Text fontSize={'xl'} as={'b'}>Shipping Address</Text>
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
                </VStack>
                <VStack spacing={4} align="flex-start" w={'full'}>
                  <Text fontSize={'xl'} as={'b'}>Second Address</Text>
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
                </VStack>
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
                  <Button type="submit" colorScheme="gray">
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