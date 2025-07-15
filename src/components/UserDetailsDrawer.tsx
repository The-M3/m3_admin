"use client"
import React from 'react';
import {
  VStack,
  HStack,
  Text,
  Badge,
  Divider,
  Box,
  Button,
  useColorModeValue
} from '@chakra-ui/react';
import { Drawer } from './Drawer';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
};

interface UserDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserDetailsDrawer({
  isOpen,
  onClose,
  user
}: UserDetailsDrawerProps) {
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const valueColor = useColorModeValue('gray.900', 'white');

  if (!user) return null;

  const footer = (
    <HStack spacing={3}>
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
      <Button colorScheme="blue">
        Edit User
      </Button>
    </HStack>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      size="md"
      footer={footer}
    >
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={valueColor} mb={2}>
            {user.name}
          </Text>
          <Badge
            colorScheme={user.status === 'Active' ? 'green' : 'gray'}
            fontSize="sm"
            px={3}
            py={1}
            rounded="full"
          >
            {user.status}
          </Badge>
        </Box>

        <Divider />

        <VStack spacing={4} align="stretch">
          <Box>
            <Text fontSize="sm" color={labelColor} mb={1}>
              User ID
            </Text>
            <Text fontSize="md" color={valueColor} fontFamily="mono">
              {user.id}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color={labelColor} mb={1}>
              Email Address
            </Text>
            <Text fontSize="md" color={valueColor}>
              {user.email}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color={labelColor} mb={1}>
              Role
            </Text>
            <Badge colorScheme="blue" fontSize="sm" px={2} py={1} rounded="md">
              {user.role}
            </Badge>
          </Box>

          <Box>
            <Text fontSize="sm" color={labelColor} mb={1}>
              Last Active
            </Text>
            <Text fontSize="md" color={valueColor}>
              {user.lastActive}
            </Text>
          </Box>
        </VStack>

        <Divider />

        <Box>
          <Text fontSize="sm" color={labelColor} mb={2}>
            Quick Actions
          </Text>
          <VStack spacing={2} align="stretch">
            <Button size="sm" variant="outline" colorScheme="blue">
              Send Message
            </Button>
            <Button size="sm" variant="outline" colorScheme="orange">
              Reset Password
            </Button>
            <Button size="sm" variant="outline" colorScheme="red">
              Suspend Account
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Drawer>
  );
}
