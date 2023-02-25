import {
  Box
} from '@chakra-ui/react';

import UserForm from '../components/UserForm'
import Header from '../components/header'

export default function Home() {
  return (
    <Box w={'full'}>
      <Header />
      <UserForm />
    </Box>
  )
}