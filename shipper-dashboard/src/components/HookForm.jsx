import { Formik, Field } from "formik";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Text,
  Divider,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import Header from "../../../user-dashboard/src/components/header";

export default function HookForm() {
  const [user] = useAuthState(auth);

  return (
    <Flex bg="gray.100" align="center" justify="center" pt='0em'>
      <Box bg="white" p={6} rounded="md" w={600}>
        <Formik
          initialValues={{
            name: "",
            userAddr1: "",
            userAddr2: "",
            userAddr3: "",
            city: "",
            postalCode: "",
            mobileNumber: "",
            title: "",
            intructions: "",
            description: "",
            dims: "",
            weight: "",
          }}
          onSubmit={(values) => {
            alert(JSON.stringify(values, null, 2));
          }}
        >
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <FormControl>
                    <Text fontSize='20px' fontWeight='semibold'>Parcel Details</Text>
                    <FormLabel htmlFor="title">Parcel Name</FormLabel>
                    <Field
                        as={Input}
                        id="title"
                        name="title"
                        type="title"
                        variant="filled"
                        placeholder="Keyboard"
                    />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="dims">Dimension</FormLabel>
                  <Field
                    as={Input}
                    id="dims"
                    name="dims"
                    type="dims"
                    variant="filled"
                    placeholder="10x30 cm"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="weight">Weight</FormLabel>
                  <Field
                    as={Input}
                    id="weight"
                    name="weight"
                    type="weight"
                    variant="filled"
                    placeholder="10 g"
                  />
                </FormControl>
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
                <FormControl isInvalid={!!errors.password && touched.password}>
                  <FormLabel htmlFor="userAddr1">Address</FormLabel>
                  <Field
                    as={Input}
                    id="userAddr1"
                    name="userAddr1"
                    type="userAddr1"
                    variant="filled"
                    placeholder="Address Line 1"
                
                  />
                  <Field
                    as={Input}
                    id="userAddr2"
                    name="userAddr2"
                    type="userAddr2"
                    variant="filled"
                    placeholder="Address Line 2"
                    
                  />
                  <Field
                    as={Input}
                    id="userAddr3"
                    name="userAddr3"
                    type="userAddr3"
                    variant="filled"
                    placeholder="Address Line 3"
                    
                  />
                  <Field
                    as={Input}
                    id="city"
                    name="city"
                    type="city"
                    variant="filled"
                    placeholder="City"
                    
                  />
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
                <FormLabel htmlFor="intructions">Delivery Instruction(s)</FormLabel>
                  <Field
                    as={Input}
                    id="intructions"
                    name="intructions"
                    type="intructions"
                    variant="filled"
                    placeholder="Leave the parcel at the door"
                  />
                <Button type="submit" colorScheme="purple" width="full">
                  Create Order
                </Button>
              </VStack>
            </form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
}