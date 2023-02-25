import { useState } from 'react'
import './App.css'
import { Card, Container } from '@chakra-ui/react'
import Navbar from './components/Navbar'
import CreateOrder from './components/CreateOrder';
import HookForm from './components/HookForm';

function App() {

  return (
    <Container minW={'100vw'} bgColor={'red.100'} height={'100vh'} m='0' p='0'>
      <Navbar />
      <HookForm />
      {/* <CreateOrder></CreateOrder> */}
    </Container>
  )
}

export default App
