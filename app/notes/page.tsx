import Link from 'next/link';

type Note = {
  title: string;
  description: string;
  path: string;
  category: string;
};

const notes: Note[] = [
  {
    title: 'Notas de Sistema Operativo',
    description: 'Apuntes y recursos sobre sistemas operativos',
    path: '/notes/OS',
    category: 'Sistemas Operativos',
  },
  // Agrega más notas aquí según sea necesario
];

export default function NotesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Mis Notas</h1>
        <p className="text-gray-600">Colección de apuntes y recursos</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Link
            key={note.path}
            href={note.path}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-3">
              {note.category}
            </span>
            <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
            <p className="text-gray-600">{note.description}</p>
            <div className="mt-4 text-blue-600 font-medium">Ver nota →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
