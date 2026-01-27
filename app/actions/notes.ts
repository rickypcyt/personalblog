'use server';

import { noteHandler } from '@/lib/note-handler';

export async function getAllNotes() {
  return await noteHandler.getAllNotes();
}

export async function getNoteBySlug(slug: string) {
  return await noteHandler.getNoteBySlug(slug);
}

export async function getLatestNote() {
  const notes = await noteHandler.getAllNotes();
  return notes[0] || null;
}
