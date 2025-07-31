"use client"
import React from 'react';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { Box } from '@chakra-ui/react';

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  const renderContent = () => {
    if (!content) return '';

    try {
      // Try to parse as raw content state (JSON)
      const rawContentState = JSON.parse(content);
      const contentState = convertFromRaw(rawContentState);
      
      // Convert to HTML with proper styling options
      const html = stateToHTML(contentState);
      
      return html;
    } catch (error) {
      // Fallback to plain text if parsing fails (for backward compatibility)
      return content.replace(/\n/g, '<br />');
    }
  };

  const htmlContent = renderContent();

  return (
    <Box
      className={className}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      sx={{
        '& ul': {
          listStyleType: 'disc',
          paddingLeft: '1.5rem',
          marginBottom: '1rem',
          marginTop: '0.5rem',
        },
        '& ol': {
          listStyleType: 'decimal',
          paddingLeft: '1.5rem',
          marginBottom: '1rem',
          marginTop: '0.5rem',
        },
        '& li': {
          marginBottom: '0.25rem',
          lineHeight: '1.5',
        },
        // '& p': {
        //   marginBottom: '1rem',
        //   lineHeight: '1.6',
        // },
        // '& h1, & h2, & h3, & h4, & h5, & h6': {
        //   fontWeight: 'bold',
        //   marginBottom: '0.5rem',
        //   marginTop: '1rem',
        // },
        // '& h1': { fontSize: '2xl' },
        // '& h2': { fontSize: 'xl' },
        // '& h3': { fontSize: 'lg' },
        // '& h4': { fontSize: 'md' },
        // '& h5': { fontSize: 'sm' },
        // '& h6': { fontSize: 'xs' },
        // '& strong': { fontWeight: 'bold' },
        // '& em': { fontStyle: 'italic' },
        // '& u': { textDecoration: 'underline' },
      }}
    />
  );
}
