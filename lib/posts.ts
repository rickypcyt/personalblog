import 'server-only';

import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

export interface PostData {
  slug: string;
  content: string;
  title: string;
  date: string;
  description: string;
  category: string;
  readTime: string;
  [key: string]: unknown; // For any additional frontmatter fields
}

const postsDirectory = path.join(process.cwd(), 'app/blog');

export function getPostSlugs() {
  try {
    return fs.readdirSync(postsDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name !== '[slug]')
      .map(dirent => dirent.name);
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

export function getPostBySlug(slug: string): PostData | null {
  try {
    const fullPath = path.join(postsDirectory, slug, 'page.mdx');
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      content,
      title: data.title as string || 'Untitled Post',
      date: data.date as string || new Date().toISOString(),
      description: data.description as string || '',
      category: data.category as string || 'Uncategorized',
      readTime: data.readTime as string || '1 min read',
      ...data,
    } as PostData;
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPosts() {
  const slugs = getPostSlugs();
  const posts = slugs
    .map(slug => getPostBySlug(slug))
    .filter((post): post is PostData => post !== null)
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

  return posts;
}
