import { noteHandler } from '@/lib/note-handler';
import { LatestNotes } from './latest-notes';

export default async function LatestNotesServer() {
  try {
    const notes = await noteHandler.getAllNotes();
    const latestNote = notes[0] || null;
    
    // Only pass serializable data with proper typing
    const serializableNote = latestNote ? {
      slug: String(latestNote.slug || ''),
      title: latestNote.title ? String(latestNote.title) : undefined,
      date: latestNote.date ? String(latestNote.date) : undefined,
      readTime: latestNote.readTime ? String(latestNote.readTime) : undefined,
      description: latestNote.description ? String(latestNote.description) : undefined,
      category: latestNote.category ? String(latestNote.category) : undefined,
    } : null;
    
    return <LatestNotes latestNote={serializableNote} />;
  } catch (error) {
    console.error('Error fetching latest note:', error);
    return <LatestNotes latestNote={null} />;
  }
}
