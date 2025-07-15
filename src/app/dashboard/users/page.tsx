"use client"
import React from 'react';
import { Box, Card, Text, Heading } from '@chakra-ui/react';

export default function UsersPage() {

  return (
    <Box>
      <Text mb={4} fontSize="3xl" fontWeight="bold" color="#122016">
        Users
      </Text>
      <Card variant="elevated" p={4}>
        <Heading mb={4} textAlign="center" fontSize="3xl" fontWeight="bold" color="#122016">
          Coming soon
        </Heading>
      </Card>
      
    </Box>
  );
}