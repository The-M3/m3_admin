"use client"
import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  Button,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Select,
  useToast,
  FormErrorMessage
} from '@chakra-ui/react';
import { Drawer } from './Drawer';
import { Event } from '@/types';
import supabase from '../../supabase-client';

interface EditEventDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onEventUpdated?: (updatedEvent: Event) => void;
}

interface FormData {
  title: string;
  location: string;
  startDateTime: string;
  timezone: string;
  description: string;
  speakers: string[];
  isVirtual: boolean;
  ticketLink: string;
}

interface FormErrors {
  title?: string;
  location?: string;
  startDateTime?: string;
  description?: string;
}

const timezones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney'
];

export function EditEventDrawer({
  isOpen,
  onClose,
  event,
  onEventUpdated
}: EditEventDrawerProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    location: '',
    startDateTime: '',
    timezone: 'UTC',
    description: '',
    speakers: [],
    isVirtual: false,
    ticketLink: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSpeaker, setNewSpeaker] = useState('');
  const toast = useToast();

  // Populate form when event changes
  useEffect(() => {
    if (event) {
      const startDateTime = new Date(event.startDateTime);
      const formattedDateTime = startDateTime.toISOString().slice(0, 16);
      
      setFormData({
        title: event.title,
        location: event.location,
        startDateTime: formattedDateTime,
        timezone: event.timezone || 'UTC',
        description: event.description,
        speakers: [...event.speakers],
        isVirtual: event.isVirtual,
        ticketLink: event.ticketLink || ''
      });
    }
  }, [event]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.startDateTime) {
      newErrors.startDateTime = 'Start date and time is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const addSpeaker = () => {
    if (newSpeaker.trim() && !formData.speakers.includes(newSpeaker.trim())) {
      handleInputChange('speakers', [...formData.speakers, newSpeaker.trim()]);
      setNewSpeaker('');
    }
  };

  const removeSpeaker = (speakerToRemove: string) => {
    handleInputChange('speakers', formData.speakers.filter(speaker => speaker !== speakerToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSpeaker();
    }
  };

  const resetForm = () => {
    if (event) {
      const startDateTime = new Date(event.startDateTime);
      const formattedDateTime = startDateTime.toISOString().slice(0, 16);
      
      setFormData({
        title: event.title,
        location: event.location,
        startDateTime: formattedDateTime,
        timezone: event.timezone || 'UTC',
        description: event.description,
        speakers: [...event.speakers],
        isVirtual: event.isVirtual,
        ticketLink: event.ticketLink || ''
      });
    }
    setErrors({});
    setNewSpeaker('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!validateForm() || !event?.id) return;

    setIsSubmitting(true);
    try {
      // Create the updated event object
      const updatedEvent: Partial<Event> = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        startDateTime: new Date(formData.startDateTime),
        timezone: formData.timezone,
        description: formData.description.trim(),
        speakers: formData.speakers,
        isVirtual: formData.isVirtual,
        ticketLink: formData.ticketLink.trim() || undefined,
        updated_at: new Date()
      };

      const { data, error } = await supabase
        .from('events')
        .update(updatedEvent)
        .eq('id', event.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Call the callback with updated event
      onEventUpdated?.(data);

      toast({
        title: 'Event Updated',
        description: `"${updatedEvent.title}" has been updated successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Close drawer
      handleClose();
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update event. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const footer = (
    <HStack spacing={3}>
      <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button
        colorScheme="blue"
        onClick={handleSubmit}
        isLoading={isSubmitting}
        loadingText="Updating..."
        disabled={isSubmitting}
      >
        Update Event
      </Button>
    </HStack>
  );

  if (!event) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Event"
      size="lg"
      footer={footer}
    >
      <VStack spacing={6} align="stretch">
        <FormControl isInvalid={!!errors.title}>
          <FormLabel>Event Title</FormLabel>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter event title"
          />
          <FormErrorMessage>{errors.title}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.location}>
          <FormLabel>Location</FormLabel>
          <Input
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Enter event location"
          />
          <FormErrorMessage>{errors.location}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.startDateTime}>
          <FormLabel>Start Date & Time</FormLabel>
          <Input
            type="datetime-local"
            value={formData.startDateTime}
            onChange={(e) => handleInputChange('startDateTime', e.target.value)}
          />
          <FormErrorMessage>{errors.startDateTime}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Timezone</FormLabel>
          <Select
            value={formData.timezone}
            onChange={(e) => handleInputChange('timezone', e.target.value)}
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter event description"
            rows={4}
          />
          <FormErrorMessage>{errors.description}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Speakers</FormLabel>
          <HStack mb={2}>
            <Input
              value={newSpeaker}
              onChange={(e) => setNewSpeaker(e.target.value)}
              placeholder="Add speaker name"
              onKeyPress={handleKeyPress}
            />
            <Button onClick={addSpeaker} size="sm">
              Add
            </Button>
          </HStack>
          <Wrap>
            {formData.speakers.map((speaker, index) => (
              <WrapItem key={index}>
                <Tag size="md" colorScheme="blue" variant="solid">
                  <TagLabel>{speaker}</TagLabel>
                  <TagCloseButton onClick={() => removeSpeaker(speaker)} />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="virtual-event" mb="0">
            Virtual Event
          </FormLabel>
          <Switch
            id="virtual-event"
            isChecked={formData.isVirtual}
            onChange={(e) => handleInputChange('isVirtual', e.target.checked)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Ticket Link (Optional)</FormLabel>
          <Input
            value={formData.ticketLink}
            onChange={(e) => handleInputChange('ticketLink', e.target.value)}
            placeholder="https://example.com/tickets"
            type="url"
          />
        </FormControl>
      </VStack>
    </Drawer>
  );
}
