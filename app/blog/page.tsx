import Link from 'next/link';

// This would typically be fetched from an API or CMS
const allPosts = [
  {
    title: 'Getting Started with Next.js and Tailwind CSS',
    date: 'November 15, 2025',
    readTime: '5 min read',
    category: 'Web Development',
    slug: 'getting-started-with-nextjs'
  },
  {
    title: 'The Art of Minimalist Design',
    date: 'November 10, 2025',
    readTime: '4 min read',
    category: 'Design',
    slug: 'minimalist-design'
  },
  {
    title: 'State Management in React',
    date: 'November 5, 2025',
    readTime: '6 min read',
    category: 'Development',
    slug: 'state-management-in-react'
  },
  {
    title: 'Building Accessible Web Apps',
    date: 'October 28, 2025',
    readTime: '7 min read',
    category: 'Accessibility',
    slug: 'accessible-web-apps'
  },
  {
    title: 'The Future of CSS',
    date: 'October 20, 2025',
    readTime: '5 min read',
    category: 'CSS',
    slug: 'future-of-css'
  }
];

export default function BlogPage() {
  // Group posts by year
  const postsByYear = allPosts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<number, typeof allPosts>);

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
