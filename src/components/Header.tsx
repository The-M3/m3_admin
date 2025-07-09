import React from 'react';
import { Box, Flex, Heading, useBreakpointValue } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
export function Header() {
  const location = useLocation();
  const isMobile = useBreakpointValue({
    base: true,
    md: false
  });
  const getPageTitle = () => {
    if (location.pathname === '/' || location.pathname === '/users') {
      return 'Users';
    }
    if (location.pathname === '/events') {
      return 'Events';
    }
    return 'Dashboard';
  };
  return <Box as="header" bg="white" borderBottom="1px" borderColor="gray.200" px={6} py={4} position="sticky" top={0} zIndex={1} width="100%">
      <Flex justify="space-between" align="center">
        <Heading size={isMobile ? 'md' : 'lg'}>{getPageTitle()}</Heading>
      </Flex>
    </Box>;
}