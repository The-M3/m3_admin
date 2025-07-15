"use client"
import React, { useState } from 'react';
import { Box, Card, CardBody, Text, Badge, Flex, Button } from '@chakra-ui/react';
import { PlusIcon } from 'lucide-react';

import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '../../../components/DataTable';
import { EventDetailsDrawer } from '../../../components/EventDetailsDrawer';
import { CreateEventDrawer } from '../../../components/CreateEventDrawer';
import { mockEventsData } from '../../../utils/mockData';
import supabase from '../../../../supabase-client';
import { toast } from 'react-toastify';
import { Event } from '@/types';


export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  const handleRowClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedEvent(null);
  };

  const handleCreateEvent = () => {
    setIsCreateDrawerOpen(true);
  };

  const handleCreateDrawerClose = () => {
    setIsCreateDrawerOpen(false);
  };

  const handleEventCreated = async (newEvent: Event) => {

    // TODO: update table / auto refresh table
    console.log("New event created", newEvent)
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const columnHelper = createColumnHelper<Event>();
  const columns = [
    columnHelper.accessor('title', {
      header: 'Event Title',
      cell: info => (
        <Text fontWeight="medium" color="blue.600">
          {info.getValue()}
        </Text>
      )
    }),
    columnHelper.accessor('startDateTime', {
      header: 'Date',
      cell: info => formatDate(info.getValue())
    }),
    columnHelper.accessor('location', {
      header: 'Location',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('isVirtual', {
      header: 'Type',
      cell: info => (
        <Badge
          colorScheme={info.getValue() ? 'blue' : 'purple'}
          fontSize="xs"
          px={2}
          py={1}
          rounded="full"
        >
          {info.getValue() ? 'Virtual' : 'In-Person'}
        </Badge>
      )
    }),
    columnHelper.accessor('hasEnded', {
      header: 'Status',
      cell: info => (
        <Badge
          colorScheme={info.getValue() ? 'gray' : 'green'}
          fontSize="xs"
          px={2}
          py={1}
          rounded="full"
        >
          {info.getValue() ? 'Ended' : 'Upcoming'}
        </Badge>
      )
    }),
    columnHelper.accessor('speakers', {
      header: 'Speakers',
      cell: info => {
        const speakers = info.getValue();
        return speakers.length > 0 ? `${speakers.length} speaker${speakers.length > 1 ? 's' : ''}` : 'TBD';
      }
    })
  ];

  return (
    <Box>
      <Text mb={4} fontSize="3xl" fontWeight="bold" color="#122016">
        Events
      </Text>
      <Flex justifyContent="flex-end" mb={4}>
        <Button 
          leftIcon={<PlusIcon size={16} />}
          px={4} 
          py={2} 
          variant="solid" 
          colorScheme="green"
          onClick={handleCreateEvent}
        >
          Create Event
        </Button>
      </Flex>
      <Card variant="outline">
        <CardBody>
          <DataTable 
            columns={columns} 
            data={mockEventsData} 
            onRowClick={handleRowClick}
          />
        </CardBody>
      </Card>
      
      <EventDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        event={selectedEvent}
      />
      
      <CreateEventDrawer
        isOpen={isCreateDrawerOpen}
        onClose={handleCreateDrawerClose}
        onEventCreated={handleEventCreated}
      />
    </Box>
  );
}