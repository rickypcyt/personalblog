import Link from 'next/link';
import { getAllNotes } from '@/app/actions/notes';

export default async function NotesPage() {
  const notes = await getAllNotes();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Mis Notas</h1>
        <p className="text-gray-600">Colección de apuntes y recursos</p>
      </header>

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay notas disponibles aún.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Link
              key={note.slug}
              href={`/notes/${note.slug}`}
              className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              {note.category && (
                <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-3">
                  {note.category}
                </span>
              )}
              <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
              {note.description && (
                <p className="text-gray-600">{note.description}</p>
              )}
              <div className="mt-4 text-blue-600 font-medium">Ver nota →</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
