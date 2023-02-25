import React, { useState } from 'react';
import {
  Box,
  Flex,
  Avatar,
  VStack,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Image,
} from "@chakra-ui/react";

export default function AvailTable(clock) {
  const dummy = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
  const [avail, setAvail] = useState(dummy);

  const changeBool = (idx) => {
    return () => {
      setAvail(prev => prev.map((entry, index) => (
        index === idx ? !entry : entry
      )))
    }
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button>Not Available?</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Click on your available timeslots and make them green!</PopoverHeader>
        <PopoverBody>
          <HStack>
            {avail.map((entry, index) => (
              <VStack onClick={changeBool(index)}>
                <Text fontSize={'sm'}>{idxToTime(index)}</Text>
                {index === clock ? <Box w={8} h={8} bg='gray' /> : entry ? <Box w={8} h={8} bg={'green'} /> : <Box w={8} h={8} bg={'red'} />}
              </VStack>
            ))
            }
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}