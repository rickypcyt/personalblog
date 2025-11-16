import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PostData } from './posts';

export interface NoteData extends Omit<PostData, 'category'> {
  // NoteData extends PostData but makes category optional and removes it from required fields
  category?: string;
  // Any additional note-specific fields can be added here
}

export class NoteHandler {
  private notesDirectory: string;
  private cache: Map<string, NoteData[] | NoteData>;
  private cacheTimestamp: number = 0;
  private CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

  constructor(notesDir: string = path.join(process.cwd(), 'app/notes')) {
    this.notesDirectory = notesDir;
    this.cache = new Map();
  }

  private shouldUseCache(): boolean {
    return Date.now() - this.cacheTimestamp < this.CACHE_DURATION;
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
          notes.push({ slug: dirent.name, path: pageMdxPath });
        }
      } else if (dirent.isFile()) {
        // Check for .md or .mdx files directly in notes directory
        const fileName = dirent.name;
        if (fileName.endsWith('.md') || fileName.endsWith('.mdx')) {
          // Skip page.mdx and page.tsx files that are route handlers
          if (fileName !== 'page.mdx' && fileName !== 'page.tsx') {
            const slug = fileName.replace(/\.(md|mdx)$/, '');
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
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
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
    const cacheKey = `note-${slug}`;
    
    if (this.cache.has(cacheKey) && this.shouldUseCache()) {
      const cached = this.cache.get(cacheKey);
      return Array.isArray(cached) ? cached[0] || null : (cached || null);
    }

    try {
      // First, try subdirectory with page.mdx (legacy format)
      let notePath = path.join(this.notesDirectory, slug, 'page.mdx');
      
      // If not found, try direct .md or .mdx file
      if (!fs.existsSync(notePath)) {
        const mdPath = path.join(this.notesDirectory, `${slug}.md`);
        const mdxPath = path.join(this.notesDirectory, `${slug}.mdx`);
        
        if (fs.existsSync(mdPath)) {
          notePath = mdPath;
        } else if (fs.existsSync(mdxPath)) {
          notePath = mdxPath;
        } else {
          return null;
        }
      }

      const content = fs.readFileSync(notePath, 'utf8');
      const note = this.parseNote(slug, content);
      
      this.cache.set(cacheKey, note);
      this.cacheTimestamp = Date.now();
      
      return note;
    } catch (error) {
      console.error(`Error reading note ${slug}:`, error);
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
