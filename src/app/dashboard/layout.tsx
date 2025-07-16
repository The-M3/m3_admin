"use client"
import React, { useState } from 'react';
import { Box, Flex, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { Menu } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface LayoutProps {
  children: React.ReactNode;
}
export default function DashboardLayout({
  children
}: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <ProtectedRoute>
      <Flex width="100%" minHeight="100vh">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
          isMobile={isMobile || false}
        />
        <Box flex="1" overflow="auto">
          {/* Mobile Header */}
          {isMobile && (
            <Flex 
              as="header" 
              align="center" 
              justify="space-between" 
              p={4} 
              bg="white" 
              borderBottom="1px" 
              borderColor="gray.200"
              position="sticky"
              top={0}
              zIndex={10}
            >
              <IconButton
                aria-label="Open menu"
                icon={<Menu />}
                variant="ghost"
                onClick={toggleSidebar}
              />
            </Flex>
          )}
          <Box as="main" px={isMobile ? 4 : 6} py={isMobile ? 4 : 6}>
            {children}
          </Box>
        </Box>
      </Flex>
    </ProtectedRoute>
  );
}