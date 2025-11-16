import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PostData } from './posts';

export class NoteHandler {
  private notesDirectory: string;
  private cache: Map<string, any>;
  private cacheTimestamp: number = 0;
  private CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

  constructor(notesDir: string = path.join(process.cwd(), 'app/notes')) {
    this.notesDirectory = notesDir;
    this.cache = new Map();
  }

  private shouldUseCache(): boolean {
    return Date.now() - this.cacheTimestamp < this.CACHE_DURATION;
  }

  private async scanNotesDirectory(): Promise<string[]> {
    if (!fs.existsSync(this.notesDirectory)) {
      console.warn(`Notes directory not found: ${this.notesDirectory}`);
      return [];
    }

    return fs.readdirSync(this.notesDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  }

  private parseNote(slug: string, content: string): PostData {
    const { data, content: markdown } = matter(content);
    
    return {
      slug,
      title: data.title || slug.replace(/-/g, ' '),
      date: data.date || new Date().toISOString(),
      description: data.description || '',
      category: data.category || 'Uncategorized',
      readTime: data.readTime || this.calculateReadTime(markdown),
      content: markdown,
      ...data,
    };
  }

  private calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  }

  async getAllNotes(): Promise<PostData[]> {
    const cacheKey = 'all-notes';
    
    if (this.cache.has(cacheKey) && this.shouldUseCache()) {
      return this.cache.get(cacheKey);
    }

    try {
      const noteDirs = await this.scanNotesDirectory();
      const notes = await Promise.all(
        noteDirs.map(async (slug) => {
          const notePath = path.join(this.notesDirectory, slug, 'page.mdx');
          const content = fs.readFileSync(notePath, 'utf8');
          return this.parseNote(slug, content);
        })
      );

      // Sort by date, newest first
      const sortedNotes = notes.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      this.cache.set(cacheKey, sortedNotes);
      this.cacheTimestamp = Date.now();
      
      return sortedNotes;
    } catch (error) {
      console.error('Error reading notes:', error);
      return [];
    }
  }

  async getNoteBySlug(slug: string): Promise<PostData | null> {
    const cacheKey = `note-${slug}`;
    
    if (this.cache.has(cacheKey) && this.shouldUseCache()) {
      return this.cache.get(cacheKey);
    }

    try {
      const notePath = path.join(this.notesDirectory, slug, 'page.mdx');
      
      if (!fs.existsSync(notePath)) {
        return null;
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

  async getNotesByCategory(category: string): Promise<PostData[]> {
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

  async searchNotes(query: string): Promise<PostData[]> {
    const notes = await this.getAllNotes();
    const queryLower = query.toLowerCase();
    
    return notes.filter(note => 
      note.title?.toLowerCase().includes(queryLower) ||
      note.content?.toLowerCase().includes(queryLower) ||
      note.description?.toLowerCase().includes(queryLower)
    );
  }
}

// Singleton instance
export const noteHandler = new NoteHandler();
