import Link from 'next/link';
import { noteHandler } from '@/lib/note-handler';

// Type for blog post list items
type BlogPostItem = {
  title: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  content?: string;
};

// Posts will be fetched from a data source in the future
const allPosts: BlogPostItem[] = [];

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

async function getAllContent(): Promise<BlogPostItem[]> {
  // Get all notes
  const notes = await noteHandler.getAllNotes();
  
  // Transform notes to match post format
  const noteItems: BlogPostItem[] = notes.map(note => {
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
  });

  // Combine with existing posts
  return [...allPosts, ...noteItems].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export default async function Page() {
  const allContent = await getAllContent();
  
  // Group content by year
  const postsByYear = allContent.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<number, BlogPostItem[]>);

  return (
    <div className="h-full bg-black text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="mb-12">
          <p className="text-gray-400 text-center">Thoughts, tutorials, and insights on web development and design.</p>
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
                      <Link href={post.slug.startsWith('/') ? post.slug : `/blog/${post.slug}`} className="block">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                          <h3 className="text-xl font-medium group-hover:text-gray-300 transition-colors">
                            {post.title}
                          </h3>
                          <time className="text-sm text-gray-500">
                            {new Date(post.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </time>
                        </div>
                        {post.content && (
                          <p className="mt-2 text-sm text-gray-400 line-clamp-3">
                            {getFirstLines(post.content)}
                          </p>
                        )}
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
      </div>
    </div>
  );
}
