"use client"
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
  Text,
  useColorModeValue,
  Switch,
} from '@chakra-ui/react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import supabase from '../../supabase-client'
import { useState } from 'react'
// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
})

export default function Home() {
  const [isSignUpPage, setIsSignUpPage] = useState(true)
  const router = useRouter()
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleSubmit = async (values: { email: string }) => {
    try {
      if(isSignUpPage){
console.log("here")
      }
      // await supabase.auth.signUp({ email: values.email, password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD! })
      router.push('/users')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Box minH="100vh" alignItems="center" justifyContent="center" display="flex" bg={'gray.50'} py={12}>
      <Container maxW="md">
        <Box
          bg={'white'}
          p={8}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          boxShadow="lg"
        >
          <VStack spacing={6}>
            <Heading size="lg" textAlign="center">
              {isSignUpPage ? 'Sign Up' : 'Welcome Back'}
            </Heading>
            <Text color="gray.600" textAlign="center">
              {isSignUpPage ? 'Please enter your email to signup': 'Please enter your email to continue'}
            </Text>

            <Formik
              initialValues={{ email: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, isValid }) => (
                <Form style={{ width: '100%' }}>
                  <VStack spacing={4} width="100%">
                    <Field name="email">
                      {({ field, form }: any) => (
                        <FormControl
                          isInvalid={form.errors.email && form.touched.email}
                        >
                          <FormLabel htmlFor="email">Email Address</FormLabel>
                          <Input
                            {...field}
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            size="lg"
                          />
                          <FormErrorMessage>
                            {form.errors.email}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Button
                      type="submit"
                      bg="#243c23"
                      size="lg"
                      width="100%"
                      color="white"
                      isLoading={isSubmitting}
                      isDisabled={!isValid}
                    >
                      {isSignUpPage ? 'Sign Up' : 'Continue'}
                    </Button>
                    <Button variant="link" onClick={() => setIsSignUpPage((prev)=> !prev)}>
                    {isSignUpPage ? 'Have an account? Sign in' : "Create an account" }
                    </Button>
                  </VStack>
                </Form>
              )}
            </Formik>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}
