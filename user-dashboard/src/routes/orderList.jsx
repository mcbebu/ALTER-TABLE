import OrderCard from '../components/ordercard'
import Header from '../components/header'
import { Center, VStack, Text, Box, SimpleGrid, Card, CardHeader, Kbd, CardBody, Button, HStack, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { auth } from '../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useQuery } from '@tanstack/react-query'
import axios from 'axios';
import { Formik, Field } from 'formik'

const dummyUser = {
  id: '129445',
  mobileNumber: '19789',
  addresses: [
    {
      userAddr1: "38 Nanyang Cres",
      userAddr2: "Saraca Hall",
      userAddr3: "22-11-22",
      city: "Singapore West",
      postalCode: "636866",
    },
    {
      userAddr1: "38 UTown",
      userAddr2: "Prince George Park",
      userAddr3: "24-1",
      city: "Singapore South",
      postalCode: "666666",
    },
  ],
}

const dummyData = [
  {
    id: '01273048120',
    name: 'Puri Virakarn',
    title: "parcel name",
    userAddrs: ["38 UTown", "Prince George Park", "24-1", "Singapore South", "666666"],
    instructions: ["Leave Parcel at the door"],
    leaveParcel: true,
    status: "On the way",
    mobileNumber: '123446',
    emailAddr: "adsfljas@opijpo.co.sg",
  },
  {
    id: '10283490870',
    name: 'Puri Virakarn',
    title: "parcel name",
    userAddrs: ["38 UTown", "Prince George Park", "24-1", "Singapore South", "666666"],
    instructions: ["Leave Parcel at the door"],
    leaveParcel: true,
    status: "Picked up",
    mobileNumber: '083290',
    emailAddr: "name@gmail.addr",
  },
  {
    id: '2134235432',
    name: 'Puri Virakarn',
    title: "parcel name",
    userAddrs: ["38 Nanyang Cres", "Saraca Hall", "22-11-22", "Singapore West", "636866"],
    instructions: ["Leave Parcel at the door"],
    leaveParcel: true,
    status: "Picked up",
    mobileNumber: '083290',
    emailAddr: "loc@facebook.ai",
  },
  {
    id: '18379489234',
    name: 'Puri Virakarn',
    title: "parcel name",
    userAddrs: ["38 Nanyang Cres", "Saraca Hall", "22-11-22", "Singapore West", "636866"],
    instructions: ["Leave Parcel at the door"],
    leaveParcel: true,
    status: "Order created",
    mobileNumber: '083290',
    emailAddr: "asdlf@asf.com",
  },
];

const getOrder = async (idToken) => {
  const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/orders`, {
    headers: {
      'Authorization': `Bearer ${idToken}`
    },
  })
  return data
}

export default function OrderedList() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const { data, isSuccess } = useQuery(['getuser'], async () => getOrder(await user.getIdToken()), {
    enabled: !!user,
  })
  const logOut = () => {
    alert('logging out...');
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate("/login")
    }).catch((error) => {
      // An error happened.
      alert(error);
    });
  }


  const OrderCard = (props) => {
    const mapColor = (status) =>{
      const statArr = ['Order created', 'Picked up', 'On the way', 'Delivered'];
      const color = ['gray.100', 'blue.100', 'yellow.100', 'green.100']
      for (let i=0;i<4;i++) 
          if (statArr[i] === status) return color[i];
      return 'red.200';
    }
    const [editing, setEditing] = useState(0);
    const [leaveParcelVal, setLeaveParcel] = useState(data.leaveParcel)
    const [addressIndex, setAddressIndex] = useState(0)
    // dummyUser.addresses.findIndex((x)=>{return x.userAddr1===data.userAddrs[0];})
    console.log(data, isSuccess)
    const addressIndexChange = (e) => {
        setAddressIndex(e.target.value)
    }
    const leaveParcelChange = (e) => {
        setLeaveParcel(e.target.value)
    }
    const writeData = (val) => {
        
    }
    return (
        <>{isSuccess && 
        <>
            {(data[props.index].status==='On the way' || 
                data[props.index].status==='Delivered') || !editing ? 
            <Card w={300}>
                <CardHeader bg='gray.300'>
                    <Center>
                        <Kbd bg={mapColor(data[props.index].status)}>{data[props.index].status}</Kbd>
                    </Center>
                    <Center>
                        <VStack>
                            <Text fontSize='20px' fontWeight='semibold'>Tracking id</Text>
                            <Kbd m={0}>{data[props.index].id}</Kbd>
                            <br />
                        </VStack>
                    </Center>
                    <Center>
                    <Text fontSize='20px' fontWeight='bold'>{data[props.index].title}</Text>
                    </Center>
                </CardHeader>
                <CardBody>
                    <Text fontSize='20px' fontWeight='semibold'>Address</Text>
                        <Box ml={6}>{data[props.index].address.userAddr1}</Box>
                        <Box ml={6}>{data[props.index].address.userAddr2}</Box>
                        <Box ml={6}>{data[props.index].address.userAddr3}</Box>
                        <Box ml={6}>{data[props.index].address.city}</Box> 
                        <Box ml={6}>{data[props.index].address.postalCode}</Box>
                    <Text fontSize='20px' fontWeight='semibold'>Contact Info</Text>
                        <Box ml={6}>{data[props.index].mobileNumber}</Box>
                        <Box ml={6}>{data[props.index].name}</Box>
                        <Box ml={6}>{data[props.index].address.emailAddr}</Box>
                    <Text fontSize='20px' fontWeight='semibold'>Delivery Instruction(s)</Text>
                    {data[props.index].instructions && <>{data[props.index].instructions.map((value, index) => (
                        <Box ml={6}>{value}</Box>
                    ))}</>}
                    <Text fontSize='20px' fontWeight='semibold'>Leave Parcel</Text>
                        <Box ml={6}>{leaveParcelVal===true? "Yes" : "No"}</Box>
                </CardBody>
                {!(data[props.index].status==='On the way' || data[props.index].status==='Delivered') &&
                    <Button colorScheme='blue' onClick={(e)=>{e.preventDefault(); setEditing(1)}} type="submit">Edit Information</Button>}
                {(data[props.index].status==='On the way' || data[props.index].status==='Delivered') &&
                    <Popover>
                        <PopoverTrigger>
                        <Button colorScheme='blue' type="submit">Edit Information</Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader> Cannot Edit Information</PopoverHeader>
                            <PopoverBody>
                                The parcel is already on the way.
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>}
            </Card> 
            :
            <Card>
                <CardHeader>
                    <Center>
                        <Kbd bg={mapColor(data[props.index].status)}>{data[props.index].status}</Kbd>
                    </Center>
                    <Center>
                        <HStack>
                            <Text fontSize='20px' fontWeight='semibold'>Tracking id</Text>
                            <Kbd>{data[props.index].id}</Kbd>
                        </HStack>
                    </Center>
                </CardHeader>
                <Flex align="center" justify="center" pt='0em'>
                    <Box bg="white" p={6} rounded="md" maxW={400} pt={0}>
                        <Formik
                        initialValues={{
                            name: data[props.index].name,
                            mobileNumber: data[props.index].mobileNumber,
                            userAddr1: data[props.index].userAddrs[0] ? data[props.index].userAddrs[0] : "Address Line 1",
                            userAddr2: data[props.index].userAddrs[1] ? data[props.index].userAddrs[1] : "Address Line 2",
                            userAddr3: data[props.index].userAddrs[2] ? data[props.index].userAddrs[2] : "Address Line 3",
                            city: data[props.index].userAddrs[3],
                            postalCode: data[props.index].userAddrs[4],
                            instructions: data[props.index].instructions,
                            leaveParcel: data[props.index].leaveParcel,
                            emailAddr: data[props.index].emailAddr,
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
                                <Text fontSize='20px' fontWeight='semibold'>Address</Text>
                                <Select onChange={(e) => addressIndexChange(e)}>
                                    {dummyUser.addresses[0] && <option value={0}>
                                        {dummyUser.addresses[0].userAddr1}
                                        , {"  "}
                                        {dummyUser.addresses[0].userAddr2}
                                        , {"  "}
                                        {dummyUser.addresses[0].userAddr3}
                                    </option>}
                                    {dummyUser.addresses[1] && <option value={1}>
                                        {dummyUser.addresses[1].userAddr1}
                                        , {"  "}
                                        {dummyUser.addresses[1].userAddr2}
                                        , {"  "}
                                        {dummyUser.addresses[1].userAddr3}
                                    </option>}
                                </Select>
                                <FormControl>
                                <Text fontSize='20px' fontWeight='semibold'>Recipient's</Text>
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
                                <FormLabel htmlFor="mobileNumber">Mobile Number</FormLabel>
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
                                <FormLabel htmlFor="emailAddr">Email Address</FormLabel>
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
                                <Text fontSize='20px' fontWeight='semibold'>Delivery Instructions</Text>
                                <FormLabel htmlFor="instructions"></FormLabel>
                                <Field
                                    as={Input}
                                    id="instructions"
                                    name="instructions"
                                    type="instructions"
                                    variant="filled"
                                />
                                </FormControl>
                                <Text fontSize='20px' fontWeight='semibold'>Leave Parcel</Text>
                                <Select onChange={(e) => leaveParcelChange(e)}>
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </Select>
                                <Button type="submit" colorScheme="purple" float={'left'}>
                                Update Changes
                                </Button>
                            </VStack>
                            </form>
                        )}
                        </Formik>
                        <Button mt={2} type="submit" colorScheme="red" float={'left'} onClick={(e)=> {e.preventDefault(); setEditing(0)}}>
                                Cancel
                        </Button>
                    </Box>
                </Flex>
            </Card>
            }
        </>
        }</>
    );
  }


  return (<>{isSuccess &&
    <h1>
      <Header currentUser={user} logOut={logOut} />
      <SimpleGrid spacingY={4} mt={6} columns={{ 'sm': 1, 'md': 3,'xl': 4 }}>
        {data && <>{data.map((eachOrder, index) => (
          <Box boxShadow={'xl'} m='auto'>
            <OrderCard index={index}></OrderCard>
          </Box>
        )
        )}</>}
      </SimpleGrid>
    </h1>}</>
  )
}

