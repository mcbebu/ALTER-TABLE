import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
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
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import logo from '../images/myninja_logo/logo_wht.png';

const Links = ['Dashboard', 'Orders'];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'/' + children}>
    {children}
  </Link>
);

export default function Header({ currentUser, logOut }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={'rgba(35,31,32)'} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Flex flex={1} mr={'auto'}>
            <IconButton
              size={'md'}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={'Open Menu'}
              onClick={isOpen ? onClose : onOpen}
            />
          </Flex>
          <Flex flex={1} alignItems="center">
            <Image src={logo} h='3em' m='auto' />
          </Flex>
          <Flex flex={1} ml='auto' justify="right">
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Text color='white'>Currently Logged In As: {currentUser?.phoneNumber}</Text>
              </MenuButton>
              <MenuList>
                <MenuItem>Dashboard</MenuItem>
                <MenuItem>Orders</MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => { logOut() }}>Log Out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {
          isOpen ? (
            <Box pb={4} >
              <Stack as={'nav'} spacing={4}>
                {Links.map((link) => (
                  <NavLink key={link}>{link}</NavLink>
                ))}
              </Stack>
            </Box>
          ) : null
        }
      </Box >
    </>
  );
}