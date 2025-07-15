"use client"
import React from 'react';
import {
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useColorModeValue
} from '@chakra-ui/react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  footer?: React.ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer
}: DrawerProps) {
  const headerBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <ChakraDrawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size={size}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader
          bg={headerBg}
          borderBottomWidth="1px"
          borderColor={borderColor}
          fontSize="lg"
          fontWeight="semibold"
        >
          {title}
        </DrawerHeader>
        <DrawerCloseButton />
        
        <DrawerBody py={4}>
          {children}
        </DrawerBody>

        {footer && (
          <DrawerFooter borderTopWidth="1px" borderColor={borderColor}>
            {footer}
          </DrawerFooter>
        )}
      </DrawerContent>
    </ChakraDrawer>
  );
}
