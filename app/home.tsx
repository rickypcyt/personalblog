import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { noteHandler } from '@/lib/note-handler';

export default async function Home() {
  const posts = getAllPosts();
  const latestNote = (await noteHandler.getAllNotes())[0];
  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col">
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Welcome to My Blog</h1>
            <div className="prose prose-invert max-w-none">
              <p className="text-xl text-gray-300 mb-6">
                Welcome to my corner of the internet. I write about web development, design, and the occasional life lesson.
                Here you&apos;ll find tutorials, thoughts, and insights from my journey as a developer.
              </p>
              <p className="text-gray-400">
                Feel free to explore the latest posts below or check out the <Link href="/blog" className="text-blue-400 hover:text-blue-300 transition-colors">blog archive</Link> for more content.
              </p>
            </div>
          </div>

          {latestNote && (
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
          )}

          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Latest Posts</h2>
            <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
              View all posts →
            </Link>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <div className="space-y-8">
              {posts.map((post: { slug: string; title: string; date?: string; readTime?: string; category?: string; description?: string }) => (
                <div key={post.slug} className="border-b border-gray-800 pb-6">
                  <h2 className="text-2xl font-semibold mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-400 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    {post.date && (
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        </time>
                      )}
                      {post.readTime && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{post.readTime}</span>
                        </>
                      )}
                      {post.category && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                            {post.category}
                          </span>
                        </>
                      )}
                    </div>
                    {post.description && (
                      <p className="text-gray-300">
                        {post.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
      </main>

      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} My Blog. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors mr-6">
                About
              </Link>
              <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
