import { 
    Card, 
    CardBody, 
    CardHeader, 
    CardFooter,
    Text,
    Kbd,
    VStack,
    HStack,
    Center,
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Button,
} from "@chakra-ui/react";
import { Formik, Field } from 'formik'

const mapColor = (status) =>{
    const statArr = ['Order created', 'Picked up', 'On the way', 'Delivered'];
    const color = ['gray.100', 'blue.100', 'yellow.100', 'green.100']
    for (let i=0;i<4;i++) {
        if (statArr[i] === status) return color[i];
    }
    return 'red.200';
}

const OrderCard = (props) => {
    return (
        <>
            {(props.data.status==='Order created' || 
                props.data.status==='Picked up') ? 
            <Card>
                <CardHeader>
                    <Center>
                        <Kbd bg={mapColor(props.data.status)}>{props.data.status}</Kbd>
                    </Center>
                    <HStack>
                        <Text fontSize='20px' fontWeight='semibold'>Tracking id</Text>
                        <Kbd>{props.data.id}</Kbd>
                    </HStack>
                </CardHeader>
            </Card> :
            <Card>
                <Flex align="center" justify="center" pt='0em'>
                    <Box bg="white" p={6} rounded="md" w={'80%'}>
                        <Text fontSize={'3xl'} mb={4}>Preferences</Text>
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
                        }}
                        onSubmit={(values) => {
                            alert(JSON.stringify(values, null, 2));
                        }}
                        >
                        {({ handleSubmit, errors, touched }) => (
                            <form onSubmit={handleSubmit}>
                            <VStack spacing={4} align="flex-start">
                                <FormControl>
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
                                <Button type="submit" colorScheme="purple" float={'right'}>
                                Create Order
                                </Button>
                            </VStack>
                            </form>
                        )}
                        </Formik>
                    </Box>
                    </Flex>
            </Card>
            }
        </>
    );
}

export default OrderCard;