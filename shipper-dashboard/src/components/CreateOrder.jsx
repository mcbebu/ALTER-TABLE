import { 
    Accordion, 
    Card, 
    CardBody, 
    CardFooter, 
    CardHeader, 
    Text,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Button
} from '@chakra-ui/react';
import React from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function CreateOrder() {
    const [data, setData] = useState([])
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = data => console.log(data);

    return (
        <>
            <Card m='auto' maxW={400} mt='10'>
                <CardHeader>
                    <Text fontSize='20px' fontWeight='semibold'>Create Order</Text>
                </CardHeader>
                <CardBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl isInvalid={errors.name}>
                        <FormLabel htmlFor='name'>First name</FormLabel>
                        <Input
                        id='name'
                        placeholder='name'
                        {...register('name', {
                            required: 'This is required',
                            minLength: { value: 4, message: 'Minimum length should be 4' },
                        })}
                        />
                        <FormErrorMessage>
                        {errors.name && errors.name.message}
                        </FormErrorMessage>
                    </FormControl>
                    <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
                        Submit
                    </Button>
                </form>

                </CardBody>
                <CardFooter>
                    <Button type='submit'>
                        Create Order
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}