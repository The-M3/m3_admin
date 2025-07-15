"use client"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { useAuth } from '@/hooks/useAuth'


export default function Home() {
  const router = useRouter()
  const { session } = useAuth()

  useEffect(() => {
    if(session){
      router.push('/dashboard/users')
    } else {
      router.push('/login')
    }
  }, [session])
  

  return (<Flex height="100vh" justifyContent="center" alignItems="center">
    <Spinner size="lg" />
      </Flex>)
}
