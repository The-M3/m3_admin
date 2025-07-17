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
  useToast,
  Image,
  IconButton,
  Progress
} from '@chakra-ui/react';
import { Drawer } from './Drawer';
import { Event } from '@/types';
import supabase from '../../supabase-client';
import { TIMEZONES } from '@/constants';

interface CreateEventDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated?: (event: Event) => void;
}

export interface EventFormData {
  title: string;
  location: string;
  startDateTime: string;
  timezone: string;
  description: string;
  speakers: string[];
  isVirtual: boolean;
  ticketLink: string;
  bannerImage: string;
}

interface FormErrors {
  title?: string;
  location?: string;
  startDateTime?: string;
  description?: string;
  bannerImage?: string;
}

export const BUCKET_NAME = 'event-banners';

export function CreateEventDrawer({
  isOpen,
  onClose,
  onEventCreated
}: CreateEventDrawerProps) {
  const toast = useToast();
  const labelColor = useColorModeValue('gray.700', 'gray.300');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [speakerInput, setSpeakerInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    location: '',
    startDateTime: '',
    timezone: 'WAT',
    description: '',
    speakers: [],
    isVirtual: false,
    ticketLink: '',
    bannerImage: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

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

  const handleInputChange = (field: keyof EventFormData, value: string | boolean | File | null) => {
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploadingImage(true);
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          bannerImage: 'Please select a valid image file (JPEG, PNG, or WebP)'
        }));
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          bannerImage: 'Image size must be less than 5MB'
        }));
        return;
      }

      // Clear any previous errors
      setErrors(prev => ({
        ...prev,
        bannerImage: undefined
      }));

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`

      // upload image to supabase
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

        console.log('Image uploaded successfully:', data);


      if (error) {
        console.error('Error uploading image:', error);
        setErrors(prev => ({
          ...prev,
          bannerImage: 'Failed to upload image. Please try again.'
        }));
        return;
      }

      const { data: publicUrlObj } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      console.log("publicUrl", publicUrlObj);


      // Update form data
      handleInputChange('bannerImage', publicUrlObj?.publicUrl);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(publicUrlObj?.publicUrl as string);
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = async (filePath: string) => {
    console.log("hello", filePath)
    handleInputChange('bannerImage', '');
    setImagePreview('');
    // Reset the file input
    const fileInput = document.getElementById('banner-image-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    const urlParts = filePath.split('/public/'); // Splits into ["...", "event-banners/1752768022061.png"]
    const pathAfterPublic = urlParts[1]; // "event-banners/1752768022061.png"

    // Further split to get the path relative to the bucket root
    const bucketNameFromUrl = pathAfterPublic.split('/')[0]; // "event-banners"
    const relativeFilePath = pathAfterPublic.substring(bucketNameFromUrl.length + 1);
    
    const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([relativeFilePath]);
    if (error) {
      console.error('Error removing image:', error);
      setErrors(prev => ({
        ...prev,
        bannerImage: 'Failed to remove image. Please try again.'
      }));
      return;
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
        bannerImage: formData.bannerImage,
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
      timezone: 'WAT',
      description: '',
      speakers: [],
      isVirtual: false,
      ticketLink: '',
      bannerImage: ''
    });
    setErrors({});
    setSpeakerInput('');
    setImagePreview('');
    // Reset the file input
    const fileInput = document.getElementById('banner-image-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
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
              {TIMEZONES.map(tz => (
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

        <FormControl isInvalid={!!errors.bannerImage}>
          <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
            Banner Image (Optional)
          </FormLabel>
          <Input
            id="banner-image-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            size="md"
            p={1}
          />
          <Text fontSize="xs" color="gray.500" mt={1}>
            Upload a banner image for your event (JPEG, PNG, or WebP, max 5MB)
          </Text>
          <FormErrorMessage>{errors.bannerImage}</FormErrorMessage>
          {isUploadingImage && <Progress colorScheme="green" size='xs' isIndeterminate />}
          {imagePreview && (
            <Box mt={3} position="relative" display="inline-block">
              <Image
                src={imagePreview}
                alt="Banner preview"
                maxH="200px"
                maxW="100%"
                objectFit="cover"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
              />
              <IconButton
                aria-label="Remove image"
                icon={<Text fontSize="lg">×</Text>}
                size="sm"
                colorScheme="red"
                position="absolute"
                top={2}
                right={2}
                onClick={() => removeImage(formData.bannerImage)}
                borderRadius="full"
              />
            </Box>
          )}
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
