'use client';

import Link from 'next/link';

interface BlogPost {
  slug: string;
  title: string;
  date?: string;
  readTime?: string;
  category?: string;
  description?: string;
}

interface LatestPostsProps {
  posts: BlogPost[];
}

export function LatestPosts({ posts }: LatestPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Latest Posts</h2>
        <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
          View all posts →
        </Link>
      </div>

      <div className="border-t border-gray-800 pt-6">
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  {post.date && (
                    <p className="text-sm text-gray-400 mb-2">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {post.readTime && ` • ${post.readTime}`}
                    </p>
                  )}
                  {post.description && (
                    <p className="text-gray-300">{post.description}</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
