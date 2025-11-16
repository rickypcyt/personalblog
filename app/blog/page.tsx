import Link from 'next/link';
import { noteHandler } from '@/lib/note-handler';

// Posts will be fetched from a data source in the future
const allPosts: Array<{
  title: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}> = [];

async function getAllContent() {
  // Get all notes
  const notes = await noteHandler.getAllNotes();
  
  // Transform notes to match post format
  const noteItems = notes.map(note => ({
    title: note.title || note.slug,
    date: note.date || new Date().toISOString().split('T')[0],
    readTime: note.readTime || '2 min read',
    category: note.category || 'Note',
    slug: `/notes/${note.slug}`
  }));

  // Combine with existing posts
  return [...allPosts, ...noteItems].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export default async function BlogPage() {
  const allContent = await getAllContent();
  
  // Group content by year
  const postsByYear = allContent.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<number, typeof allContent>);

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Blog</h1>
          <p className="text-gray-400">Thoughts, tutorials, and insights on web development and design.</p>
        </div>

        <div className="space-y-12">
          {Object.entries(postsByYear)
            .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
            .map(([year, posts]) => (
              <section key={year} className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-300">{year}</h2>
                <div className="space-y-6 border-l border-gray-800 pl-4">
                  {posts.map((post, index) => (
                    <article key={index} className="group relative">
                      <Link href={`/blog/${post.slug}`} className="block">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                          <h3 className="text-xl font-medium group-hover:text-gray-300 transition-colors">
                            {post.title}
                          </h3>
                          <time className="text-sm text-gray-500">{post.date}</time>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>{post.category}</span>
                          <span className="mx-2">•</span>
                          <span>{post.readTime}</span>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            ))}
        </div>
      </main>
    </div>
  );
}
