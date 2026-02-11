// Notes system for The Garden
import { storage } from './storage';

export type NoteState = 'seed' | 'sprout' | 'bloom';
export type ResponseLevel = 'silent' | 'close_circle' | 'private_annotations';
export type NoteVisibility = 'private' | 'garden' | 'circle';
export type WorkType = 'poetry' | 'prose' | 'fragment' | 'essay' | 'fiction' | 'personal' | 'experimental';

export interface NoteVersion {
  content: string;
  savedAt: string;
}

// CROSS-POLLINATION SOCIAL LAYER - garden verbs, not social media verbs
export interface TendAction {
  userId: string;
  userName: string;
  tendedAt: string;
}

export interface GraftConnection {
  fromNoteId: string;
  fromNoteTitle: string;
  fromUserId: string;
  fromUserName: string;
  graftedAt: string;
}

export interface GardenNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  state: NoteState;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  revisitCount: number;
  isPublic: boolean;
  sharedWithCircles: string[];
  responseLevel: ResponseLevel;
  versions: NoteVersion[];
  // Connection system - friction is the product
  growsFrom: string[]; // IDs of notes this grows from
  growsInto: string[]; // IDs of notes that grow from this
  revisitDate?: string | null;
  // CRITICAL: Publishing choice - nothing public unless explicitly chosen
  visibility: NoteVisibility; // 'private' (default), 'garden' (explore page), 'circle' (specific circles)
  // CROSS-POLLINATION SOCIAL ACTIONS
  tendedBy: TendAction[]; // Who has tended this note (spent time with it)
  graftedFrom?: GraftConnection; // If this note was grafted from another
  graftedTo: string[]; // IDs of notes that were grafted from this one
  transplantHistory: string[]; // History of moves between circles/gallery
  workType: WorkType; // Type of work this note represents
}

const NOTES_KEY = 'garden_notes';

export const notesService = {
  // Get all notes
  getAllNotes: (): GardenNote[] => {
    return storage.get<GardenNote[]>(NOTES_KEY) || [];
  },

  // Get notes by user ID
  getNotes: (userId: string): GardenNote[] => {
    const allNotes = notesService.getAllNotes();
    return allNotes.filter(note => note.userId === userId);
  },

  // Get note by ID
  getNoteById: (noteId: string): GardenNote | null => {
    const allNotes = notesService.getAllNotes();
    return allNotes.find(note => note.id === noteId) || null;
  },

  // Create new note
  createNote: (
    userId: string,
    title: string = 'Untitled',
    content: string = '',
    state: NoteState = 'seed'
  ): GardenNote => {
    const allNotes = notesService.getAllNotes();
    
    const newNote: GardenNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      content,
      state,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      wordCount: notesService.calculateWordCount(content),
      revisitCount: 0,
      isPublic: false,
      sharedWithCircles: [],
      responseLevel: 'silent',
      versions: [],
      growsFrom: [],
      growsInto: [],
      revisitDate: null,
      visibility: 'private',
      // CROSS-POLLINATION SOCIAL ACTIONS
      tendedBy: [],
      graftedTo: [],
      transplantHistory: [],
      workType: 'prose' // Default work type
    };

    allNotes.push(newNote);
    storage.set(NOTES_KEY, allNotes);

    return newNote;
  },

  // Update note
  updateNote: (noteId: string, updates: Partial<GardenNote>): GardenNote | null => {
    const allNotes = notesService.getAllNotes();
    const noteIndex = allNotes.findIndex(note => note.id === noteId);

    if (noteIndex === -1) return null;

    const currentNote = allNotes[noteIndex];
    
    // Save version if content changed
    if (updates.content && updates.content !== currentNote.content) {
      currentNote.versions.push({
        content: currentNote.content,
        savedAt: new Date().toISOString()
      });
    }

    // Update word count if content changed
    if (updates.content) {
      updates.wordCount = notesService.calculateWordCount(updates.content);
    }

    const updatedNote = {
      ...currentNote,
      ...updates,
      updatedAt: new Date().toISOString(),
      revisitCount: currentNote.revisitCount + 1
    };

    allNotes[noteIndex] = updatedNote;
    storage.set(NOTES_KEY, allNotes);

    return updatedNote;
  },

  // Delete note
  deleteNote: (noteId: string): boolean => {
    const allNotes = notesService.getAllNotes();
    const filteredNotes = allNotes.filter(note => note.id !== noteId);

    if (filteredNotes.length === allNotes.length) return false;

    storage.set(NOTES_KEY, filteredNotes);
    return true;
  },

  // Change note state
  changeNoteState: (noteId: string, newState: NoteState): GardenNote | null => {
    return notesService.updateNote(noteId, { state: newState });
  },

  // Calculate word count
  calculateWordCount: (content: string): number => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    if (!text) return 0;
    return text.split(/\s+/).filter(word => word.length > 0).length;
  },

  // Get notes by state
  getNotesByState: (userId: string, state: NoteState): GardenNote[] => {
    return notesService.getNotes(userId).filter(note => note.state === state);
  },

  // Get notes by tag
  getNotesByTag: (userId: string, tag: string): GardenNote[] => {
    return notesService.getNotes(userId).filter(note => note.tags.includes(tag));
  },

  // Search notes
  searchNotes: (userId: string, query: string): GardenNote[] => {
    const lowerQuery = query.toLowerCase();
    return notesService.getNotes(userId).filter(note => 
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },

  // Get all tags for a user
  getUserTags: (userId: string): string[] => {
    const notes = notesService.getNotes(userId);
    const tagSet = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet);
  }
};