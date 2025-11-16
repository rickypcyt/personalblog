'use client';

import Link from 'next/link';
import { LatestNotes } from './latest-notes';
import { LatestPosts } from './latest-posts';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

interface Note {
  slug: string;
  title?: string;
  date?: string;
  readTime?: string;
  description?: string;
  category?: string;
}

interface HomePageProps {
  latestNote: Note | null;
  posts: Post[];
}

export default function HomePage({ latestNote, posts }: HomePageProps) {
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
                Feel free to explore the latest posts below or check out the{' '}
                <Link href="/blog" className="text-blue-400 hover:text-blue-300 transition-colors">
                  blog archive
                </Link>{' '}
                for more content.
              </p>
            </div>
          </div>

          <LatestNotes latestNote={latestNote} />
          <LatestPosts posts={posts} />
        </div>
      </main>
    </div>
  );
}
