import { getAllNotes, getNoteBySlug } from '../../actions/notes';

import { MDXRemote } from 'next-mdx-remote/rsc';
import { Metadata } from 'next';
import { components } from '@/components/mdx-components';
import { notFound } from 'next/navigation';

// Generate static paths for all notes
export async function generateStaticParams() {
  const notes = await getAllNotes();
  return notes.map((note) => ({
    slug: note.slug,
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
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
    title: (note.title as string) || 'Untitled Note',
    description: (note.description as string) || '',
    openGraph: {
      title: (note.title as string) || 'Untitled Note',
      description: (note.description as string) || '',
      type: 'article',
      publishedTime: (note.date as string) || '',
      ...(note.author ? { authors: [note.author as string] } : {}),
    },
  };
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }
  
  const note = await getNoteBySlug(slug);
  
  if (!note) {
    notFound();
  }

  // Create custom components that filter out duplicate H1 titles
  const customComponents = {
    ...components,
    h1: ({ children }: { children?: React.ReactNode }) => {
      // Don't render H1 if it matches the front matter title
      const h1Text = typeof children === 'string' 
        ? children 
        : String(children || '').replace(/[<>]/g, '');
      if (h1Text.trim() === (note.title as string)?.trim()) {
        return null;
      }
      return <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>;
    },
  };

  return (
    <div className="h-full bg-black text-gray-100">
      <article className="prose prose-invert max-w-4xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{(note.title as string) || 'Untitled Note'}</h1>
          <div className="flex items-center gap-3 mt-2">
            {(note.date as string) && (
              <time dateTime={note.date as string} className="text-sm text-gray-500">
                {new Date(note.date as string).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
            {(note.category as string) && (
              <span className="inline-block bg-gray-800 text-gray-200 text-sm px-3 py-1 rounded-full">
                {note.category as string}
              </span>
            )}
          </div>
        </header>
      
        <div className="prose prose-invert max-w-none">
          <MDXRemote source={note.content as string} components={customComponents} />
        </div>
      </article>
    </div>
  );
}
