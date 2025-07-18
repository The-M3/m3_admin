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
} from '@chakra-ui/react'
import { Formik, Form, Field, FormikHelpers, FieldProps } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import supabase from '../../../supabase-client'
import { toast } from 'react-toastify'

// Form data interface
interface LoginFormValues {
  email: string;
  password: string;
}

// Validation schema using Yup
const validationSchema = Yup.object<LoginFormValues>({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
})

export default function LoginPage() {
  const [isSignUpPage, setIsSignUpPage] = useState(false)
  const router = useRouter()
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const [signupSuccessMsg, setSignupSuccessMsg] = useState('')

  const handleSubmit = async (values: LoginFormValues, { setSubmitting }: FormikHelpers<LoginFormValues>) => {
    setSubmitting(true)
    try {
      if(isSignUpPage){
        const { data, error } = await supabase.auth.signUp({ email: values.email, password: values.password })
        console.log("data", data)
        if(error){
          console.log(error)
          toast.error(error.message)
        } else {
          toast.success("User created successfully")
          setSignupSuccessMsg("Confirm your email to continue")
          data.session && router.push('/dashboard/events')
        }
      } else if(!isSignUpPage){
        const { data, error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password })
       
        if(error){
          console.log(error)
          toast.error(error.message)
        } else {
          toast.success("User logged in successfully")
          data.session && router.push('/dashboard/events')
        }
      }
    } catch (error) {
      console.error('Authentication error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setSubmitting(false)
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
            {signupSuccessMsg && <Text color="green.500" textAlign="center">{signupSuccessMsg}</Text>}
            <Text color="gray.600" textAlign="center">
              {isSignUpPage ? 'Please enter your credentials to signup': 'Please enter your credentials to continue'}
            </Text>

            <Formik<LoginFormValues>
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, isValid }) => (
                <Form style={{ width: '100%' }}>
                  <VStack spacing={4} width="100%">
                    <Field name="email">
                      {({ field, form }: FieldProps<string, LoginFormValues>) => (
                        <FormControl
                          isInvalid={!!(form.errors.email && form.touched.email)}
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
                    <Field name="password">
                      {({ field, form }: FieldProps<string, LoginFormValues>) => (
                        <FormControl
                          isInvalid={!!(form.errors.password && form.touched.password)}
                        >
                          <FormLabel htmlFor="password">Password</FormLabel>
                          <Input
                            {...field}
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            size="lg"
                          />
                          <FormErrorMessage>
                            {form.errors.password}
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
