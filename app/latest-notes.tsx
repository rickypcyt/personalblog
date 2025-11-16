'use client';

import Link from 'next/link';
import type { NoteData } from '@/lib/types';

interface LatestNotesProps {
  latestNote: (NoteData & { date?: string; readTime?: string; }) | null;
}

export function LatestNotes({ latestNote }: LatestNotesProps) {
  if (!latestNote) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Latest Note</h2>
        <Link href="/notes" className="text-sm text-gray-400 hover:text-white transition-colors">
          View all notes →
        </Link>
      </div>
      <div className="border border-gray-800 rounded-lg p-6 hover:bg-gray-900/50 transition-colors">
        <h3 className="text-xl font-semibold mb-2">
          <Link href={`/notes/${latestNote.slug}`} className="text-blue-400 hover:text-blue-300 transition-colors">
            {latestNote.title || 'Untitled Note'}
          </Link>
        </h3>
        {latestNote.date && (
          <p className="text-sm text-gray-400 mb-3">
            {new Date(latestNote.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            {latestNote.readTime && ` • ${latestNote.readTime}`}
          </p>
        )}
        {latestNote.description && (
          <p className="text-gray-300 mb-4">{latestNote.description}</p>
        )}
        <Link 
          href={`/notes/${latestNote.slug}`}
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          Read note →
        </Link>
      </div>
    </div>
  );
}
