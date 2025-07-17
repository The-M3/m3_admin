export interface Event {
    id?: string;              // UUID, auto-generated
    title: string;           // Required
    location: string;        // Required
    startDateTime: Date;     // Required
    timezone?: string;       // Optional
    description: string;     // Required
    speakers: string[];      // Array of speaker names
    isVirtual: boolean;      // Default: false
    ticketLink?: string;     // Optional
    hasEnded: boolean;       // Default: false
    created_at?: Date;         // Auto-generated
    updated_at?: Date;         // Auto-generated
    bannerImage?: string;     // Optional
  }
