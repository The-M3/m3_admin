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
  Link
} from '@chakra-ui/react';
import { Drawer } from './Drawer';
import { Event } from '@/types';

interface EventDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

export function EventDetailsDrawer({
  isOpen,
  onClose,
  event
}: EventDetailsDrawerProps) {
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const valueColor = useColorModeValue('gray.900', 'white');

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

  const footer = (
    <HStack spacing={3}>
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
      <Button colorScheme="blue">
        Edit Event
      </Button>
      {event.ticketLink && (
        <Button as={Link} href={event.ticketLink} colorScheme="green" isExternal>
          View Tickets
        </Button>
      )}
    </HStack>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Event Details"
      size="lg"
      footer={footer}
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
            <Button size="sm" variant="outline" colorScheme="blue">
              Send Reminder
            </Button>
            <Button size="sm" variant="outline" colorScheme="orange">
              Export Attendees
            </Button>
            <Button size="sm" variant="outline" colorScheme="red">
              Cancel Event
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
    </Drawer>
  );
}
