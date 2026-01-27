import Link from 'next/link';
import { noteHandler } from '@/lib/note-handler';

// Type for note list items
type NoteItem = {
  title: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  content?: string;
};

// Function to get first 3 lines of content
function getFirstLines(content: string, maxLines: number = 3): string {
  if (!content) return '';
  
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const selectedLines = lines.slice(0, maxLines);
  
  // Remove markdown formatting and clean up
  return selectedLines
    .map(line => line.replace(/^#+\s/, '').replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1'))
    .join(' ')
    .substring(0, 150) + (selectedLines.join(' ').length > 150 ? '...' : '');
}

async function getAllNotes(): Promise<NoteItem[]> {
  // Get all notes
  const notes = await noteHandler.getAllNotes();
  
  // Transform notes to match post format
  return notes.map(note => {
    // Ensure date is always a string
    let dateStr: string;
    if (!note.date) {
      dateStr = new Date().toISOString().split('T')[0];
    } else if (note.date instanceof Date) {
      dateStr = note.date.toISOString().split('T')[0];
    } else {
      dateStr = String(note.date);
    }
    
    return {
      title: String(note.title || note.slug),
      date: dateStr,
      readTime: String(note.readTime || '2 min read'),
      category: String(note.category || 'Note'),
      slug: `/notes/${note.slug}`,
      content: String(note.content || '')
    };
  }).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export default async function Page() {
  const notes = await getAllNotes();
  
  // Group notes by year
  const notesByYear = notes.reduce((acc, note) => {
    const year = new Date(note.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(note);
    return acc;
  }, {} as Record<number, NoteItem[]>);

  return (
    <div className="h-full bg-black text-gray-100">
      <div className="prose prose-invert max-w-4xl mx-auto p-4">
        <div className="my-6">
          <p className="text-gray-400 text-center">Thoughts, tutorials, and insights on web development and design.</p>
        </div>

        <div className="space-y-12">
          {Object.entries(notesByYear)
            .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
            .map(([year, yearNotes]) => (
              <section key={year} className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-300">{year}</h2>
                <div className="space-y-6 border-l border-gray-800 pl-4">
                  {yearNotes.map((note, index) => (
                    <article key={index} className="group relative">
                      <Link href={note.slug} className="block">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                          <h3 className="text-xl font-medium group-hover:text-gray-300 transition-colors">
                            {note.title}
                          </h3>
                          <time className="text-sm text-gray-500">
                            {new Date(note.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </time>
                        </div>
                        {note.content && (
                          <p className="mt-2 text-sm text-gray-400 line-clamp-3">
                            {getFirstLines(note.content)}
                          </p>
                        )}
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>{note.category}</span>
                          <span className="mx-2">•</span>
                          <span>{note.readTime}</span>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            ))}
        </div>
      </div>
    </div>
  );
}
