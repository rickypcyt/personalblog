import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import Image from 'next/image';

// Define custom components with TypeScript types
const customComponents: MDXComponents = {

  // Customize headings
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mt-8 mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold mt-6 mb-2">{children}</h3>
  ),
  
  // Paragraphs and text
  p: ({ children }) => (
    <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>
  ),
  
  // Links
  a: ({ href, children }) => {
    const isExternal = href?.startsWith('http');
    
    if (isExternal) {
      return (
        <a 
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
        >
          {children}
        </a>
      );
    }
    
    return (
      <Link 
        href={href || '#'}
        className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
      >
        {children}
      </Link>
    );
  },
  
  // Lists
  ul: ({ children }) => (
    <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-gray-300">{children}</li>
  ),
  
  // Blockquotes
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-600 pl-4 italic my-4 text-gray-400">
      {children}
    </blockquote>
  ),
  
  // Code blocks
  code: ({ className, children }) => {
    const language = className?.replace('language-', '');
    return (
      <code className={`text-sm ${className}`} data-language={language}>
        {children}
      </code>
    );
  },
  
  pre: ({ children }) => (
    <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
      <pre className="font-mono text-sm">{children}</pre>
    </div>
  ),
  
  // Images with Next.js Image component
  img: ({ src, alt }) => (
    <div className="my-6">
      <div className="relative w-full h-96">
        <Image
          src={src || ''}
          alt={alt || ''}
          fill
          className="rounded-lg object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          priority={false}
        />
      </div>
      {alt && (
        <p className="text-center text-sm text-gray-400 mt-2">{alt}</p>
      )}
    </div>
  ),
};

// Export the components for direct use
export const components = customComponents;

// This is a compatibility wrapper for the MDX provider
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...customComponents,
    ...components,
  };
}
