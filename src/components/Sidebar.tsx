'use client';
import React from 'react';
import { 
  Box, 
  Flex, 
  Icon, 
  Link, 
  Text, 
  VStack, 
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton
} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { UsersIcon, CalendarIcon, LogOutIcon } from 'lucide-react';
import Image from 'next/image';
import supabase from '../../supabase-client';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ isOpen = false, onClose = () => {}, isMobile = false }: SidebarProps) {
  const location = usePathname();
  const router = useRouter()
  const navItems = [{
    name: 'Events',
    path: '/dashboard/events',
    icon: CalendarIcon
  }];

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const sidebarContent = (
    <Box 
      bg="#243c23" 
      height="100vh" 
      py={4} 
      display="flex" 
      flexDirection="column"
      width="100%"
    >
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
      </Flex>
      <VStack spacing={1} align="stretch">
        {navItems.map(item => (
          <Link 
            as={Link} 
            href={item.path} 
            key={item.path} 
            display="flex" 
            alignItems="center" 
            px={4} 
            py={3} 
            textDecoration="none" 
            color="white" 
            bg={location === item.path ? '#3a6538' : 'transparent'} 
            _hover={{
              bg: '#3a6538'
            }}
            onClick={isMobile ? onClose : undefined}
          >
            <Icon as={item.icon} boxSize={5} />
            <Text ml={3} display={{
              base: isMobile ? 'block' : 'none',
              lg: 'block'
            }}>
              {item.name}
            </Text>
          </Link>
        ))}
      </VStack>

      <Box 
        mb={isMobile ? 36 : 16} 
        marginTop="auto" 
        cursor="pointer" 
        display="flex" 
        alignItems="center" 
        px={4} 
        py={3} 
        textDecoration="none" 
        color="white" 
        _hover={{
          bg: '#3a6538'
        }} 
        onClick={() => {
          logout();
          if (isMobile) onClose();
        }}
      >
        <Icon as={LogOutIcon} boxSize={5} />
        <Text ml={3} display={{
          base: isMobile ? 'block' : 'none',
          lg: 'block'
        }}>
          Logout
        </Text>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent maxWidth="280px">
          <DrawerCloseButton color="white" zIndex={1} />
          <DrawerBody p={0}>
            {sidebarContent}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Box 
      width={{
        base: '70px',
        lg: '240px'
      }} 
      borderRight="1px" 
      borderColor="gray.200" 
      position="sticky" 
      top="0"
    >
      {sidebarContent}
    </Box>
  );
}