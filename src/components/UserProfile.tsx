"use client"
import { Box, Button, Text, VStack, HStack, Avatar } from '@chakra-ui/react'
import { useAuth } from '../hooks/useAuth'

export function UserProfile() {
  const { user, signOut, loading } = useAuth()

  if (loading) {
    return <Text>Loading user...</Text>
  }

  if (!user) {
    return <Text>No user found</Text>
  }

  return (
    <Box p={4} borderWidth={1} borderRadius="md" bg="white" shadow="sm">
      <VStack spacing={3} align="start">
        <HStack spacing={3}>
          <Avatar size="sm" name={user.email || 'User'} />
          <VStack align="start" spacing={0}>
            <Text fontWeight="semibold">{user.email}</Text>
            <Text fontSize="sm" color="gray.600">
              ID: {user.id.slice(0, 8)}...
            </Text>
          </VStack>
        </HStack>
        
        <Button 
          size="sm" 
          colorScheme="red" 
          variant="outline"
          onClick={signOut}
        >
          Sign Out
        </Button>
      </VStack>
    </Box>
  )
}
