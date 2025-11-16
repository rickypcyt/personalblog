// Shared types that can be used in both server and client components
// This file does NOT import server-only modules

export interface NoteData {
  slug: string;
  title?: string;
  date?: string;
  readTime?: string;
  description?: string;
  category?: string;
}

// Extended version for server-side use (includes content)
export interface NoteDataWithContent extends NoteData {
  content: string;
  excerpt?: string;
}

