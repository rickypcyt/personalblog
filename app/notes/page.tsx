import Link from 'next/link';
import { getAllNotes } from '@/app/actions/notes';

export default async function NotesPage() {
  const notes = await getAllNotes();

  return (
    <div className="h-full bg-black text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Mis Notas</h1>
          <p className="text-gray-400">Colección de apuntes y recursos</p>
        </header>

        {notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay notas disponibles aún.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Link
                key={note.slug as string}
                href={`/notes/${note.slug as string}`}
                className="block p-6 bg-gray-900 rounded-lg border border-gray-800 shadow-sm hover:shadow-md hover:bg-gray-800 transition-all"
              >
                {(note.category as string) && (
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-900 text-blue-200 rounded-full mb-3">
                    {note.category as string}
                  </span>
                )}
                <h2 className="text-xl font-semibold mb-2 text-white">{(note.title as string) || 'Untitled Note'}</h2>
                {(note.description as string) && (
                  <p className="text-gray-400">{note.description as string}</p>
                )}
                <div className="mt-4 text-blue-400 font-medium">Ver nota →</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
