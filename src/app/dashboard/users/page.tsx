"use client"
import React from 'react';
import { Box, Card, CardBody, Heading, Text } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '../../../components/DataTable';
import { mockUsers } from '../../../utils/mockData';
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
};
export default function UsersPage() {
  const columnHelper = createColumnHelper<User>();
  const columns = [columnHelper.accessor('name', {
    header: 'Name',
    cell: info => info.getValue()
  }), columnHelper.accessor('email', {
    header: 'Email',
    cell: info => info.getValue()
  }), columnHelper.accessor('role', {
    header: 'Role',
    cell: info => info.getValue()
  }), columnHelper.accessor('status', {
    header: 'Status',
    cell: info => <Text px={2} py={1} rounded="full" fontSize="xs" fontWeight="semibold" textAlign="center" bg={info.getValue() === 'Active' ? 'green.100' : 'gray.100'} color={info.getValue() === 'Active' ? 'green.700' : 'gray.700'} width="80px">
      {info.getValue()}
    </Text>
  }), columnHelper.accessor('lastActive', {
    header: 'Last Active',
    cell: info => info.getValue()
  })];

  return (
  <Box>
      <Text mb={4} fontSize="3xl" fontWeight="bold" color="#122016">
        Users
      </Text>
    <Card variant="outline">
      <CardBody>
        <DataTable columns={columns} data={mockUsers} />
      </CardBody>
    </Card>
  </Box>
  );
}