import { PostData } from './posts';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

export interface NoteData extends Omit<PostData, 'category'> {
  // NoteData extends PostData but makes category optional and removes it from required fields
  category?: string;
  // Any additional note-specific fields can be added here
}

export class NoteHandler {
  private notesDirectory: string;
  private cache: Map<string, NoteData[] | NoteData>;
  private cacheTimestamp: number = 0;
  private CACHE_DURATION = 1000 * 30; // 30 seconds for development

  constructor(notesDir: string = path.join(process.cwd(), 'app/notes')) {
    this.notesDirectory = notesDir;
    this.cache = new Map();
  }

  private shouldUseCache(): boolean {
    return Date.now() - this.cacheTimestamp < this.CACHE_DURATION;
  }

  /**
   * Normalizes a filename to a URL-friendly slug
   * Converts spaces to hyphens, removes special characters, etc.
   */
  private normalizeSlug(fileName: string): string {
    // Remove file extension
    let slug = fileName.replace(/\.(md|mdx)$/, '');
    
    // Convert to lowercase
    slug = slug.toLowerCase();
    
    // Replace spaces and underscores with hyphens
    slug = slug.replace(/[\s_]+/g, '-');
    
    // Remove special characters except hyphens
    slug = slug.replace(/[^a-z0-9-]/g, '');
    
    // Replace multiple consecutive hyphens with a single hyphen
    slug = slug.replace(/-+/g, '-');
    
    // Remove leading and trailing hyphens
    slug = slug.replace(/^-+|-+$/g, '');
    
    return slug;
  }

  private async scanNotesDirectory(): Promise<Array<{ slug: string; path: string }>> {
    if (!fs.existsSync(this.notesDirectory)) {
      console.warn(`Notes directory not found: ${this.notesDirectory}`);
      return [];
    }

    const notes: Array<{ slug: string; path: string }> = [];

    // Scan for markdown files directly in the notes directory
    const files = fs.readdirSync(this.notesDirectory, { withFileTypes: true });
    
    for (const dirent of files) {
      // Skip directories that are routes (like [slug])
      if (dirent.isDirectory() && !dirent.name.startsWith('[')) {
        // Check for page.mdx in subdirectories
        const pageMdxPath = path.join(this.notesDirectory, dirent.name, 'page.mdx');
        if (fs.existsSync(pageMdxPath)) {
          const slug = this.normalizeSlug(dirent.name);
          notes.push({ slug, path: pageMdxPath });
        }
      } else if (dirent.isFile()) {
        // Check for .md or .mdx files directly in notes directory
        const fileName = dirent.name;
        if (fileName.endsWith('.md') || fileName.endsWith('.mdx')) {
          // Skip page.mdx and page.tsx files that are route handlers
          if (fileName !== 'page.mdx' && fileName !== 'page.tsx') {
            const slug = this.normalizeSlug(fileName);
            const filePath = path.join(this.notesDirectory, fileName);
            notes.push({ slug, path: filePath });
          }
        }
      }
    }

    return notes;
  }

  private parseNote(slug: string, content: string): NoteData {
    const { data, content: markdownContent } = matter(content);
    const readTime = this.calculateReadTime(markdownContent);
    
    return {
      slug,
      content: markdownContent,
      title: data.title || 'Untitled Note',
      date: data.date || new Date().toISOString(),
      description: data.description || '',
      category: data.category || 'Uncategorized',
      readTime,
      ...data
    } as NoteData;
  }

  private calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  }

  async getAllNotes(): Promise<NoteData[]> {
    const cacheKey = 'all-notes';
    
    if (this.cache.has(cacheKey) && this.shouldUseCache()) {
      const cached = this.cache.get(cacheKey);
      return Array.isArray(cached) ? cached : [];
    }

    try {
      const noteFiles = await this.scanNotesDirectory();
      const notes = await Promise.all(
        noteFiles.map(async ({ slug, path: notePath }) => {
          const content = fs.readFileSync(notePath, 'utf8');
          return this.parseNote(slug, content);
        })
      );

      // Sort by date, newest first
      const sortedNotes = notes.sort((a, b) => {
        const dateA = a.date ? new Date(a.date as string).getTime() : 0;
        const dateB = b.date ? new Date(b.date as string).getTime() : 0;
        return dateB - dateA;
      });

      this.cache.set(cacheKey, sortedNotes);
      this.cacheTimestamp = Date.now();
      
      return sortedNotes;
    } catch (error) {
      console.error('Error reading notes:', error);
      return [];
    }
  }

  async getNoteBySlug(slug: string): Promise<NoteData | null> {
    // Decode URL-encoded slug (handles %20 for spaces, etc.)
    // If already decoded or invalid, use original slug
    let decodedSlug: string;
    try {
      decodedSlug = decodeURIComponent(slug);
    } catch {
      decodedSlug = slug;
    }
    const cacheKey = `note-${decodedSlug}`;
    
    if (this.cache.has(cacheKey) && this.shouldUseCache()) {
      const cached = this.cache.get(cacheKey);
      return Array.isArray(cached) ? cached[0] || null : (cached || null);
    }

    try {
      // Normalize the slug to match how we generate slugs from filenames
      const normalizedSlug = this.normalizeSlug(decodedSlug);
      
      // Scan directory to find file whose normalized name matches the slug
      if (!fs.existsSync(this.notesDirectory)) {
        return null;
      }

      const files = fs.readdirSync(this.notesDirectory, { withFileTypes: true });
      let notePath: string | null = null;
      
      for (const dirent of files) {
        if (dirent.isDirectory() && !dirent.name.startsWith('[')) {
          // Check subdirectory with page.mdx
          const dirSlug = this.normalizeSlug(dirent.name);
          if (dirSlug === normalizedSlug) {
            const pageMdxPath = path.join(this.notesDirectory, dirent.name, 'page.mdx');
            if (fs.existsSync(pageMdxPath)) {
              notePath = pageMdxPath;
              break;
            }
          }
        } else if (dirent.isFile()) {
          // Check .md or .mdx files
          const fileName = dirent.name;
          if ((fileName.endsWith('.md') || fileName.endsWith('.mdx')) &&
              fileName !== 'page.mdx' && fileName !== 'page.tsx') {
            const fileSlug = this.normalizeSlug(fileName);
            if (fileSlug === normalizedSlug) {
              notePath = path.join(this.notesDirectory, fileName);
              break;
            }
          }
        }
      }

      if (!notePath) {
        return null;
      }

      const content = fs.readFileSync(notePath, 'utf8');
      const note = this.parseNote(normalizedSlug, content);
      
      this.cache.set(cacheKey, note);
      this.cacheTimestamp = Date.now();
      
      return note;
    } catch (error) {
      console.error(`Error reading note ${decodedSlug}:`, error);
      return null;
    }
  }

  async getNotesByCategory(category: string): Promise<NoteData[]> {
    const notes = await this.getAllNotes();
    return notes.filter(note => 
      note.category?.toLowerCase() === category.toLowerCase()
    );
  }

  async getCategories(): Promise<string[]> {
    const notes = await this.getAllNotes();
    const categories = new Set<string>();
    
    notes.forEach(note => {
      if (note.category) {
        categories.add(note.category);
      }
    });
    
    return Array.from(categories).sort();
  }

  async searchNotes(query: string): Promise<NoteData[]> {
    const notes = await this.getAllNotes();
    const queryLower = query.toLowerCase();
    
    return notes.filter(note => {
      const title = typeof note.title === 'string' ? note.title.toLowerCase() : '';
      const content = typeof note.content === 'string' ? note.content.toLowerCase() : '';
      const description = typeof note.description === 'string' ? note.description.toLowerCase() : '';
      
      return (
        title.includes(queryLower) ||
        content.includes(queryLower) ||
        description.includes(queryLower)
      );
    });
  }
}

// Singleton instance
export const noteHandler = new NoteHandler();
