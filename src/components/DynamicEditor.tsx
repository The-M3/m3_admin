"use client"
import dynamic from 'next/dynamic';
import { EditorState } from 'draft-js';
import { Box } from '@chakra-ui/react';

// Dynamically import the Editor with SSR disabled
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <Box
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        minHeight="200px"
        padding="10px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="gray.500"
      >
        Loading editor...
      </Box>
    ),
  }
);

interface DynamicEditorProps {
  editorState: EditorState;
  onEditorStateChange: (editorState: EditorState) => void;
  placeholder?: string;
  toolbar?: any;
  editorStyle?: any;
}

export function DynamicEditor({
  editorState,
  onEditorStateChange,
  placeholder,
  toolbar,
  editorStyle,
}: DynamicEditorProps) {
  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      placeholder={placeholder}
      toolbar={toolbar}
      editorStyle={editorStyle}
    />
  );
}
