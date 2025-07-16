"use client"
import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  Button,
  useColorModeValue,
  FormErrorMessage,
  Select,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Box,
  useToast
} from '@chakra-ui/react';
import { Drawer } from './Drawer';
import { Event } from '@/types';
import supabase from '../../supabase-client';

interface CreateEventDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated?: (event: Event) => void;
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

export function CreateEventDrawer({
  isOpen,
  onClose,
  onEventCreated
}: CreateEventDrawerProps) {
  const toast = useToast();
  const labelColor = useColorModeValue('gray.700', 'gray.300');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [speakerInput, setSpeakerInput] = useState('');

  const [formData, setFormData] = useState<FormData>({
    title: '',
    location: '',
    startDateTime: '',
    timezone: 'WAT',
    description: '',
    speakers: [],
    isVirtual: false,
    ticketLink: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const timezones = [
    'WAT','EST', 'CST', 'MST', 'PST', 'GMT', 'CET', 'JST', 'AEST'
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
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

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
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
    if (speakerInput.trim() && !formData.speakers.includes(speakerInput.trim())) {
      setFormData(prev => ({
        ...prev,
        speakers: [...prev.speakers, speakerInput.trim()]
      }));
      setSpeakerInput('');
    }
  };

  const removeSpeaker = (speakerToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.filter(speaker => speaker !== speakerToRemove)
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the event object
      const newEvent: Event = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        startDateTime: new Date(formData.startDateTime),
        timezone: formData.timezone || undefined,
        description: formData.description.trim(),
        speakers: formData.speakers,
        isVirtual: formData.isVirtual,
        ticketLink: formData.ticketLink.trim() || undefined,
        hasEnded: false,
      };

      // Insert into database first
      const { data, error } = await supabase.from('events').insert([newEvent]).select();
      
      if (error) {
        console.error('Error creating event:', error);
        toast({
          title: 'Error',
          description: `${error.message}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      console.log('Event created successfully:', data);
      
      // Only call onEventCreated after successful database insert
      if (data && data[0]) {
        onEventCreated?.(data[0] as Event);
      }
      
      toast({
        title: 'Event Created',
        description: `"${newEvent.title}" has been created successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form and close drawer
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      startDateTime: '',
      timezone: 'EST',
      description: '',
      speakers: [],
      isVirtual: false,
      ticketLink: ''
    });
    setErrors({});
    setSpeakerInput('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const footer = (
    <HStack spacing={3}>
      <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button
        colorScheme="green"
        onClick={handleSubmit}
        isLoading={isSubmitting}
        loadingText="Creating..."
      >
        Create Event
      </Button>
    </HStack>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Event"
      size="lg"
      footer={footer}
    >
      <VStack spacing={6} align="stretch">
        <FormControl isInvalid={!!errors.title} isRequired>
          <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
            Event Title
          </FormLabel>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter event title"
            size="md"
          />
          <FormErrorMessage>{errors.title}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.location} isRequired>
          <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
            Location
          </FormLabel>
          <Input
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Enter event location"
            size="md"
          />
          <FormErrorMessage>{errors.location}</FormErrorMessage>
        </FormControl>

        <HStack spacing={4} align="flex-start">
          <FormControl isInvalid={!!errors.startDateTime} isRequired flex={2}>
            <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
              Start Date & Time
            </FormLabel>
            <Input
              type="datetime-local"
              value={formData.startDateTime}
              onChange={(e) => handleInputChange('startDateTime', e.target.value)}
              size="md"
            />
            <FormErrorMessage>{errors.startDateTime}</FormErrorMessage>
          </FormControl>

          <FormControl flex={1}>
            <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
              Timezone
            </FormLabel>
            <Select
              value={formData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              size="md"
            >
              {timezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </Select>
          </FormControl>
        </HStack>

        <FormControl isInvalid={!!errors.description} isRequired>
          <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
            Description
          </FormLabel>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter event description"
            rows={4}
            resize="vertical"
          />
          <FormErrorMessage>{errors.description}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
            Speakers
          </FormLabel>
          <HStack mb={2}>
            <Input
              value={speakerInput}
              onChange={(e) => setSpeakerInput(e.target.value)}
              placeholder="Enter speaker name"
              size="md"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSpeaker();
                }
              }}
            />
            <Button onClick={addSpeaker} size="md" colorScheme="blue" variant="outline">
              Add
            </Button>
          </HStack>
          {formData.speakers.length > 0 && (
            <Box>
              <Text fontSize="sm" color={labelColor} mb={2}>
                Added Speakers:
              </Text>
              <Wrap>
                {formData.speakers.map((speaker, index) => (
                  <WrapItem key={index}>
                    <Tag size="md" colorScheme="blue" borderRadius="full">
                      <TagLabel>{speaker}</TagLabel>
                      <TagCloseButton onClick={() => removeSpeaker(speaker)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          )}
        </FormControl>

        <FormControl>
          <HStack justify="space-between">
            <FormLabel color={labelColor} fontSize="sm" fontWeight="medium" mb={0}>
              Virtual Event
            </FormLabel>
            <Switch
              isChecked={formData.isVirtual}
              onChange={(e) => handleInputChange('isVirtual', e.target.checked)}
              colorScheme="blue"
            />
          </HStack>
          <Text fontSize="xs" color="gray.500" mt={1}>
            Toggle if this is a virtual/online event
          </Text>
        </FormControl>

        <FormControl>
          <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
            Ticket Link (Optional)
          </FormLabel>
          <Input
            value={formData.ticketLink}
            onChange={(e) => handleInputChange('ticketLink', e.target.value)}
            placeholder="https://tickets.example.com/event"
            size="md"
            type="url"
          />
          <Text fontSize="xs" color="gray.500" mt={1}>
            Link where attendees can purchase tickets
          </Text>
        </FormControl>
      </VStack>
    </Drawer>
  );
}
