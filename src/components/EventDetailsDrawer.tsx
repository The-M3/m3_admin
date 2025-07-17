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
  useColorModeValue,
  Link,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Image
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { Drawer } from './Drawer';
import { EditEventDrawer } from './EditEventDrawer';
import { Event } from '@/types';
import supabase from '../../supabase-client';

interface EventDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onEventUpdated?: () => void;
}

export function EventDetailsDrawer({
  isOpen,
  onClose,
  event,
  onEventUpdated
}: EventDetailsDrawerProps) {
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const valueColor = useColorModeValue('gray.900', 'white');
  const toast = useToast();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [isUpdating, setIsUpdating] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const deleteRef = useRef<HTMLButtonElement>(null);

  if (!event) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelEvent = async () => {
    if (!event?.id) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('events')
        .update({
          hasEnded: true,
        })
        .eq('id', event.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Event Cancelled',
        description: `"${event.title}" has been cancelled successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Call the callback to refresh the events list
      onEventUpdated?.();

      // Close the drawer
      onClose();
    } catch (error: any) {
      console.error('Error cancelling event:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel event. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
      onAlertClose();
    }
  };

  const handleDeleteEvent = async () => {
    if (!event?.id) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Event Deleted',
        description: `"${event.title}" has been deleted successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Call the callback to refresh the events list
      onEventUpdated?.();

      // Close the drawer
      onClose();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete event. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
      onDeleteClose();
    }
  };

  const handleEventUpdated = (updatedEvent: Event) => {
    // Call the callback to refresh the events list
    onEventUpdated?.();
    // Close the edit drawer
    onEditClose();
  };

  // const footer = (
  //   <HStack spacing={3}>
  //     <Button variant="outline" onClick={onClose}>
  //       Close
  //     </Button>
  //     <Button colorScheme="blue">
  //       Edit Event
  //     </Button>
  //     {event.ticketLink && (
  //       <Button as={Link} href={event.ticketLink} colorScheme="green" isExternal>
  //         View Tickets
  //       </Button>
  //     )}
  //   </HStack>
  // );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Event Details"
      size="lg"
    // footer={footer}
    >
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={valueColor} mb={2}>
            {event.title}
          </Text>
          <HStack spacing={2} mb={2}>
            <Badge
              colorScheme={event.hasEnded ? 'gray' : 'green'}
              fontSize="sm"
              px={3}
              py={1}
              rounded="full"
            >
              {event.hasEnded ? 'Ended' : 'Upcoming'}
            </Badge>
            <Badge
              colorScheme={event.isVirtual ? 'blue' : 'purple'}
              fontSize="sm"
              px={3}
              py={1}
              rounded="full"
            >
              {event.isVirtual ? 'Virtual' : 'In-Person'}
            </Badge>
          </HStack>
        </Box>

        <Divider />

        <VStack spacing={4} align="stretch">
          <Box>
            <Text fontSize="sm" color={labelColor} mb={1}>
              Event ID
            </Text>
            <Text fontSize="md" color={valueColor} fontFamily="mono">
              {event.id}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color={labelColor} mb={1}>
              Date & Time
            </Text>
            <Text fontSize="md" color={valueColor}>
              {formatDate(event.startDateTime)}
              {event.timezone && (
                <Text as="span" fontSize="sm" color={labelColor} ml={2}>
                  ({event.timezone})
                </Text>
              )}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color={labelColor} mb={1}>
              Location
            </Text>
            <Text fontSize="md" color={valueColor}>
              {event.location}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color={labelColor} mb={1}>
              Banner Image
            </Text>
            <Box mt={3} position="relative" display="inline-block">
              <Image
                src={event.bannerImage}
                alt="Banner preview"
                maxH="200px"
                maxW="100%"
                objectFit="cover"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
              />
            </Box>
          </Box>



          <Box>
            <Text fontSize="sm" color={labelColor} mb={1}>
              Description
            </Text>
            <Text fontSize="md" color={valueColor} lineHeight="1.6">
              {event.description}
            </Text>
          </Box>

          {event.speakers.length > 0 && (
            <Box>
              <Text fontSize="sm" color={labelColor} mb={2}>
                Speakers
              </Text>
              <HStack spacing={2} flexWrap="wrap">
                {event.speakers.map((speaker, index) => (
                  <Badge
                    key={index}
                    colorScheme="blue"
                    fontSize="sm"
                    px={2}
                    py={1}
                    rounded="md"
                  >
                    {speaker}
                  </Badge>
                ))}
              </HStack>
            </Box>
          )}
        </VStack>

        <Divider />

        <Box>
          <Text fontSize="sm" color={labelColor} mb={2}>
            Quick Actions
          </Text>
          <VStack spacing={2} align="stretch">
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue"
              onClick={onEditOpen}
              isDisabled={event.hasEnded}
            >
              Edit Event
            </Button>
            {/* <Button size="sm" variant="outline" colorScheme="orange">
              Send Reminder
            </Button>
            <Button size="sm" variant="outline" colorScheme="green">
              Export Attendees
            </Button> */}
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              onClick={onAlertOpen}
              isDisabled={event.hasEnded}
            >
              {event.hasEnded ? 'Event ended' : 'End Event'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              onClick={onDeleteOpen}
            >
              Delete Event
            </Button>
          </VStack>
        </Box>

        <Divider />

        <Box>
          <HStack justify="space-between" fontSize="sm" color={labelColor}>
            <Text>Created: {formatDate(event?.created_at!)}</Text>
            <Text>Updated: {formatDate(event?.updated_at!)}</Text>
          </HStack>
        </Box>
      </VStack>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel Event
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to cancel "{event.title}"? This action will mark the event as ended and cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Keep Event
              </Button>
              <Button
                colorScheme="red"
                onClick={handleCancelEvent}
                ml={3}
                isLoading={isUpdating}
                loadingText="Cancelling..."
              >
                Cancel Event
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={deleteRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Event
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{event.title}"? This action will delete the event and cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={deleteRef} onClick={onDeleteClose}>
                Keep Event
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteEvent}
                ml={3}
                isLoading={isUpdating}
                loadingText="Deleting..."
              >
                Delete Event
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <EditEventDrawer
        isOpen={isEditOpen}
        onClose={onEditClose}
        event={event}
        onEventUpdated={handleEventUpdated}
      />
    </Drawer>
  );
}
