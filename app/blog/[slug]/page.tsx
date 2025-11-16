import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { components } from '@/components/mdx-components';

// This function tells Next.js which paths to pre-render
export async function generateStaticParams() {
  const { getPostSlugs } = await import('@/lib/posts');
  const slugs = getPostSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) {
    return {
      title: 'Post not found',
      description: 'The requested post could not be found.'
    };
  }
  
  const post = getPostBySlug(slug);
  
  if (!post) {
    return { 
      title: 'Post not found',
      description: 'The requested post could not be found.'
    };
  }
  
  return {
    title: post.title || 'Untitled Post',
    description: post.description || '',
    openGraph: {
      title: post.title || 'Untitled Post',
      description: post.description || '',
      type: 'article',
      publishedTime: post.date || '',
      ...(post.author ? { authors: [post.author] } : {}),
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }
  
  const post = getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <article className="prose prose-invert max-w-2xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{post.title || 'Untitled Post'}</h1>
        {post.date && (
          <div className="flex items-center text-sm text-gray-400 mb-6">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
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
        )}
      </header>
      
      <div className="prose prose-invert max-w-none">
        <MDXRemote source={post.content} components={components} />
      </div>
    </article>
  );
}
