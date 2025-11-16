import { noteHandler } from '@/lib/note-handler';
import { LatestNotes } from './latest-notes';

export default async function LatestNotesServer() {
  try {
    const notes = await noteHandler.getAllNotes();
    const latestNote = notes[0] || null;
    
    // Only pass serializable data
    const serializableNote = latestNote ? {
      slug: latestNote.slug,
      title: latestNote.title,
      date: latestNote.date,
      readTime: latestNote.readTime,
      description: latestNote.description,
      category: latestNote.category,
    } : null;
    
    return <LatestNotes latestNote={serializableNote} />;
  } catch (error) {
    console.error('Error fetching latest note:', error);
    return <LatestNotes latestNote={null} />;
  }
}
