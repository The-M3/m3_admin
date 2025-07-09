import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
interface LayoutProps {
  children: React.ReactNode;
}
export function DashboardLayout({
  children
}: LayoutProps) {
  return <Flex width="100%" minHeight="100vh">
      <Sidebar />
      <Box flex="1" overflow="auto">
        {/* <Header /> */}
        <Box as="main" p={6} pt={4}>
          {children}
        </Box>
      </Box>
    </Flex>;
}