import Link from 'next/link';
import { PostData } from '@/lib/posts';

interface HomePageProps {
  latestNote?: {
    slug: string;
    title: string;
    date: string;
    readTime: string;
    description: string;
    category?: string;
  } | null;
  posts: PostData[];
}

export default function Home({ latestNote }: HomePageProps) {
  return (
    <div className="h-full bg-black text-gray-100">
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
      </div>
    </div>
  )
}
