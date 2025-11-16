import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getNoteBySlug, getAllNotes } from '../../actions/notes';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { components } from '@/components/mdx-components';

// Generate static paths for all notes
export async function generateStaticParams() {
  const notes = await getAllNotes();
  return notes.map((note: { slug: string }) => ({
    slug: note.slug,
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const { slug } = params;
  if (!slug) {
    return {
      title: 'Note not found',
      description: 'The requested note could not be found.'
    };
  }
  
  const note = await getNoteBySlug(slug);
  
  if (!note) {
    return { 
      title: 'Note not found',
      description: 'The requested note could not be found.'
    };
  }
  
  return {
    title: note.title || 'Untitled Note',
    description: note.description || '',
    openGraph: {
      title: note.title || 'Untitled Note',
      description: note.description || '',
      type: 'article',
      publishedTime: note.date || '',
      ...(note.author ? { authors: [note.author] } : {}),
    },
  };
}

export default async function NotePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  if (!slug) {
    notFound();
  }
  
  const note = await getNoteBySlug(params.slug);
  
  if (!note) {
    notFound();
  }

  return (
    <article className="prose prose-invert max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{note.title || 'Untitled Note'}</h1>
        {note.date && (
          <time dateTime={note.date} className="text-sm text-gray-500">
            {new Date(note.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        )}
        {note.category && (
          <span className="inline-block bg-gray-800 text-gray-200 text-sm px-3 py-1 rounded-full mt-2">
            {note.category}
          </span>
        )}
      </header>
      
      <div className="prose prose-invert max-w-none">
        <MDXRemote source={note.content} components={components} />
      </div>
    </article>
  );
}
