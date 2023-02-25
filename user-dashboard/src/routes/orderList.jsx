import OrderCard from '../components/ordercard'
import Header from '../components/header'
import { Center, VStack, Text, Box } from '@chakra-ui/react';

const dummyData = [
  {
    id: '01273048120',
    title: "parcel name",
    userAddrs: ["Addr1", "Addr2", "Addr3", "city", "postalCode"],
    instructions: ["Leave Parcel at the door"],
    leaveParcel: true,
    status: "On the way",
    mobileNumber: '123446',
    emailAddr: "",
  },
  {
    id: '10283490870',
    title: "parcel name",
    userAddrs: ["Addr1", "Addr2", "Addr3", "city", "postalCode"],
    instructions: ["Leave Parcel at the door"],
    leaveParcel: true,
    status: "Picked up",
    mobileNumber: '083290',
    emailAddr: "",
  },
  {
    id: '2134235432',
    title: "parcel name",
    userAddrs: ["Addr1", "Addr2", "Addr3", "city", "postalCode"],
    instructions: ["Leave Parcel at the door"],
    leaveParcel: true,
    status: "Picked up",
    mobileNumber: '083290',
    emailAddr: "",
  },
  {
    id: '18379489234',
    title: "parcel name",
    userAddrs: ["Addr1", "Addr2", "Addr3", "city", "postalCode"],
    instructions: ["Leave Parcel at the door"],
    leaveParcel: true,
    status: "Order Created",
    mobileNumber: '083290',
    emailAddr: "",
  },
];

export default function OrderedList() {
  return (
    <h1>
      <Header />
      <VStack spacing={4} mt={6}>
        {dummyData.map((eachOrder, index) => (
          <Box boxShadow={'xl'}>
            <OrderCard data={eachOrder} index={index}></OrderCard>
          </Box>
          )
        )}
      </VStack>
    </h1>
  )
}