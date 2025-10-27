import {create} from 'zustand';
import {Note, CreateNoteInput, UpdateNoteInput} from '../types';
import notesStorageService from '../services/notesStorageService';

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;

  loadNotes: (userId: string) => Promise<void>;
  loadNotesByCharacter: (userId: string, characterId: number) => Promise<void>;
  createNote: (userId: string, input: CreateNoteInput) => Promise<Note>;
  updateNote: (userId: string, noteId: string, input: UpdateNoteInput) => Promise<void>;
  deleteNote: (userId: string, noteId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,

  loadNotes: async (userId: string) => {
    set({isLoading: true, error: null});
    try {
      const notes = await notesStorageService.getNotesByUser(userId);
      set({notes, isLoading: false});
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load notes',
        isLoading: false,
      });
    }
  },

  loadNotesByCharacter: async (userId: string, characterId: number) => {
    set({isLoading: true, error: null});
    try {
      const notes = await notesStorageService.getNotesByCharacter(
        userId,
        characterId,
      );
      set({notes, isLoading: false});
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load notes',
        isLoading: false,
      });
    }
  },

  createNote: async (userId: string, input: CreateNoteInput) => {
    set({error: null});
    try {
      const note = await notesStorageService.createNote(userId, input);
      set(state => ({notes: [...state.notes, note]}));
      return note;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create note',
      });
      throw error;
    }
  },

  updateNote: async (
    userId: string,
    noteId: string,
    input: UpdateNoteInput,
  ) => {
    set({error: null});
    try {
      const updatedNote = await notesStorageService.updateNote(
        userId,
        noteId,
        input,
      );
      set(state => ({
        notes: state.notes.map(note =>
          note.id === noteId ? updatedNote : note,
        ),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update note',
      });
      throw error;
    }
  },

  deleteNote: async (userId: string, noteId: string) => {
    set({error: null});
    try {
      await notesStorageService.deleteNote(userId, noteId);
      set(state => ({
        notes: state.notes.filter(note => note.id !== noteId),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete note',
      });
      throw error;
    }
  },

  clearError: () => set({error: null}),

  reset: () => set({notes: [], isLoading: false, error: null}),
}));
