"use client"
import React, { useState, useEffect } from 'react';
import { Box, Card, CardBody, Text, Badge, Flex, Button, Spinner, Alert, AlertIcon, useToast, useBreakpointValue } from '@chakra-ui/react';
import { PlusIcon } from 'lucide-react';

import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '../../../components/DataTable';
import { EventDetailsDrawer } from '../../../components/EventDetailsDrawer';
import { CreateEventDrawer } from '../../../components/CreateEventDrawer';
import supabase from '../../../../supabase-client';
import { Event } from '@/types';


export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });
  

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

  const fetchEvents = async (page: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const from = page * pageSize;
      const to = from + pageSize - 1;
      
      // Fetch events with pagination
      const { data, error, count } = await supabase
        .from('events')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) {
        throw error;
      }
      
      setEvents(data || []);
      setTotalCount(count || 0);
      setCurrentPage(page);
    } catch (err: { message: string } | unknown) {
      console.error('Error fetching events:', err);
      setError((err as { message: string })?.message || 'Failed to fetch events');
      toast({
        title: 'Error',
        description: 'Failed to fetch events. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEventCreated = async (newEvent: Event) => {
    console.log("New event created", newEvent);
    fetchEvents();
  };


  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchEvents(newPage);
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
        <CardBody {...(isMobile ? { p: 2 } : {})}>
          {loading ? (
            <Flex justify="center" align="center" minH="200px">
              <Spinner size="lg" color="green.500" />
            </Flex>
          ) : error ? (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          ) : (
            <DataTable 
              columns={columns} 
              data={events} 
              onRowClick={handleRowClick}
              totalCount={totalCount}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          )}
        </CardBody>
      </Card>
      
      <EventDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        event={selectedEvent}
        onEventUpdated={fetchEvents}
      />
      
      <CreateEventDrawer
        isOpen={isCreateDrawerOpen}
        onClose={handleCreateDrawerClose}
        onEventCreated={handleEventCreated}
      />
    </Box>
  );
}