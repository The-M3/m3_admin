'use client';
import React from 'react';
import { Box, Flex, Icon, Link, Text, VStack } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { UsersIcon, CalendarIcon, LayoutDashboardIcon } from 'lucide-react';
import Image from 'next/image';


export function Sidebar() {
  const location = usePathname();
  const navItems = [{
    name: 'Users',
    path: '/users',
    icon: UsersIcon
  }, {
    name: 'Events',
    path: '/events',
    icon: CalendarIcon
  }];
  return <Box width={{
    base: '70px',
    lg: '240px'
  }} bg="#243c23" borderRight="1px" borderColor="gray.200" height="100vh" position="sticky" top="0" py={4}>
    <Flex px={4} mb={8} alignItems="center" justifyContent={{
      base: 'center',
      lg: 'flex-start'
    }}>
        <Image
          src="/svgs/appIcon.svg"
          alt="The M3"
          width={80}
          height={40}
          priority
        />
      {/* <Text fontWeight="bold" fontSize="xl" ml={2} display={{
        base: 'none',
        lg: 'block'
      }}>
        Dashboard
      </Text> */}
    </Flex>
    <VStack spacing={1} align="stretch">
      {navItems.map(item => <Link as={Link} href={item.path} key={item.path} display="flex" alignItems="center" px={4} py={3} textDecoration="none" color="white" bg={location === item.path ? '#3a6538' : 'transparent'} _hover={{
        bg: '#3a6538'
      }}>
        <Icon as={item.icon} boxSize={5} />
        <Text ml={3} display={{
          base: 'none',
          lg: 'block'
        }}>
          {item.name}
        </Text>
      </Link>)}
    </VStack>
  </Box>;
}