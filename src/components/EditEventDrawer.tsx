"use client"
import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
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
  FormErrorMessage,
  Progress,
  Image,
  Box,
  IconButton
} from '@chakra-ui/react';
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import { DynamicEditor } from './DynamicEditor';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'draft-js/dist/Draft.css';
import { Drawer } from './Drawer';
import { Event } from '@/types';
import supabase from '../../supabase-client';
import { BUCKET_NAME, EventFormData } from './CreateEventDrawer';
import { TIMEZONES } from '@/constants';

interface EditEventDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onEventUpdated?: (updatedEvent: Event) => void;
}

interface FormErrors {
  title?: string;
  location?: string;
  startDateTime?: string;
  description?: string;
  bannerImage?: string;
}

export function EditEventDrawer({
  isOpen,
  onClose,
  event,
  onEventUpdated
}: EditEventDrawerProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    location: '',
    startDateTime: '',
    timezone: 'UTC',
    description: '',
    speakers: [],
    isVirtual: false,
    ticketLink: '',
    bannerImage: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSpeaker, setNewSpeaker] = useState('');
  const toast = useToast();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty()
  );

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
        ticketLink: event.ticketLink || '',
        bannerImage: event.bannerImage || ''
      });
      
      // Initialize editor state with existing description
      if (event.description) {
        try {
          // Try to parse as raw content state (JSON)
          const rawContentState = JSON.parse(event.description);
          const contentState = convertFromRaw(rawContentState);
          setEditorState(EditorState.createWithContent(contentState));
        } catch (error) {
          // Fallback to plain text if parsing fails (for backward compatibility)
          const contentState = ContentState.createFromText(event.description);
          setEditorState(EditorState.createWithContent(contentState));
        }
      } else {
        setEditorState(EditorState.createEmpty());
      }
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

  const handleInputChange = (field: keyof EventFormData, value: string | boolean | string[]) => {
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
        ticketLink: event.ticketLink || '',
        bannerImage: event.bannerImage || ''
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
        bannerImage: formData.bannerImage
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
          setIsUploadingImage(false);
        };
        reader.readAsDataURL(file);
      }
    };
  

  const removeImage = async (filePath: string) => {
    console.log("hello", filePath)
    setIsUploadingImage(true);
    handleInputChange('bannerImage', '');
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
    
    const { error } = await supabase.storage
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
    setIsUploadingImage(false);
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
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel>Description</FormLabel>
          <Box border="1px solid" borderColor="gray.200" borderRadius="md">
            <DynamicEditor
              editorState={editorState}
              onEditorStateChange={(editorState: EditorState) => {
                setEditorState(editorState);
                // Convert editor content to raw format to preserve formatting
                const contentState = editorState.getCurrentContent();
                const rawContentState = convertToRaw(contentState);
                handleInputChange('description', JSON.stringify(rawContentState));
              }}
              placeholder="Enter event description"
              toolbar={{
                options: ['inline', 'list', 'textAlign', 'history'],
                inline: {
                  options: ['bold', 'italic', 'underline']
                },
                list: {
                  options: ['unordered', 'ordered']
                }
              }}
              editorStyle={{
                minHeight: '200px',
                padding: '10px',
                border: 'none'
              }}
            />
          </Box>
          <FormErrorMessage>{errors.description}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.bannerImage}>
                  <FormLabel fontSize="sm" fontWeight="medium">
                    Banner Image (Optional)
                  </FormLabel>
                 {!formData.bannerImage && <Input
                    id="banner-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    size="md"
                    p={1}
                  />}
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Upload a banner image for your event (JPEG, PNG, or WebP, max 5MB)
                  </Text>
                  <FormErrorMessage>{errors.bannerImage}</FormErrorMessage>
                  {isUploadingImage && <Progress colorScheme="green" size='xs' isIndeterminate />}
                  {formData.bannerImage && (
                    <Box mt={3} position="relative" display="inline-block">
                      <Image
                        src={formData.bannerImage}
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
