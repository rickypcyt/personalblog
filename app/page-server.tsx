import { noteHandler } from '@/lib/note-handler';
import { getAllPosts } from '@/lib/posts';
import HomePage from './home-page';

export default async function HomePageServer() {
  // Fetch data on the server
  const [notes, posts] = await Promise.all([
    noteHandler.getAllNotes().catch(() => []),
    Promise.resolve(getAllPosts())
  ]);

  const latestNote = notes[0] || null;
  
  // Only pass serializable data to client components
  const serializableNote = latestNote ? {
    slug: latestNote.slug,
    title: latestNote.title,
    date: latestNote.date,
    readTime: latestNote.readTime,
    description: latestNote.description,
    category: latestNote.category,
  } : null;

  return <HomePage latestNote={serializableNote} posts={posts} />;
}
