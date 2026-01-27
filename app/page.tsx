import Home from './home';
import { getAllPosts } from '@/lib/posts';
import { noteHandler } from '@/lib/note-handler';

export default async function Page() {
  // Fetch data on the server
  const [notes, posts] = await Promise.all([
    noteHandler.getAllNotes().catch(() => []),
    Promise.resolve(getAllPosts())
  ]);

  const latestNote = notes[0] || null;
  
  // Only pass serializable data to client components
  const serializableNote = latestNote ? {
    slug: latestNote.slug as string,
    title: latestNote.title as string,
    date: latestNote.date as string,
    readTime: latestNote.readTime as string,
    description: latestNote.description as string,
    category: latestNote.category as string | undefined,
  } : null;

  return <Home latestNote={serializableNote} posts={posts} />;
}
