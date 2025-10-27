import AsyncStorage from '@react-native-async-storage/async-storage';
import {Note, CreateNoteInput, UpdateNoteInput} from '../types';

class NotesStorageService {
  private readonly NOTES_KEY = '@simpsons_app:notes';

  async createNote(
    userId: string,
    input: CreateNoteInput,
  ): Promise<Note> {
    try {
      const notes = await this.getAllNotes();

      const newNote: Note = {
        id: this.generateId(),
        userId,
        characterId: input.characterId,
        title: input.title,
        text: input.text,
        rating: input.rating,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      notes.push(newNote);
      await AsyncStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));

      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  async getNotesByUser(userId: string): Promise<Note[]> {
    try {
      const notes = await this.getAllNotes();
      return notes.filter(note => note.userId === userId);
    } catch (error) {
      console.error('Error getting user notes:', error);
      return [];
    }
  }

  async getNotesByCharacter(
    userId: string,
    characterId: number,
  ): Promise<Note[]> {
    try {
      const notes = await this.getAllNotes();
      return notes.filter(
        note => note.userId === userId && note.characterId === characterId,
      );
    } catch (error) {
      console.error('Error getting character notes:', error);
      return [];
    }
  }

  async getNoteById(userId: string, noteId: string): Promise<Note | null> {
    try {
      const notes = await this.getAllNotes();
      const note = notes.find(n => n.id === noteId && n.userId === userId);
      return note || null;
    } catch (error) {
      console.error('Error getting note:', error);
      return null;
    }
  }

  async updateNote(
    userId: string,
    noteId: string,
    input: UpdateNoteInput,
  ): Promise<Note> {
    try {
      const notes = await this.getAllNotes();
      const noteIndex = notes.findIndex(
        n => n.id === noteId && n.userId === userId,
      );

      if (noteIndex === -1) {
        throw new Error('Note not found or access denied');
      }

      const updatedNote: Note = {
        ...notes[noteIndex],
        ...input,
        updatedAt: new Date().toISOString(),
      };

      notes[noteIndex] = updatedNote;
      await AsyncStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));

      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  async deleteNote(userId: string, noteId: string): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const filteredNotes = notes.filter(
        n => !(n.id === noteId && n.userId === userId),
      );

      if (filteredNotes.length === notes.length) {
        throw new Error('Note not found or access denied');
      }

      await AsyncStorage.setItem(this.NOTES_KEY, JSON.stringify(filteredNotes));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  async hasNotesForCharacter(
    userId: string,
    characterId: number,
  ): Promise<boolean> {
    const notes = await this.getNotesByCharacter(userId, characterId);
    return notes.length > 0;
  }

  private async getAllNotes(): Promise<Note[]> {
    try {
      const notesData = await AsyncStorage.getItem(this.NOTES_KEY);
      return notesData ? JSON.parse(notesData) : [];
    } catch (error) {
      console.error('Error getting all notes:', error);
      return [];
    }
  }

  private generateId(): string {
    return `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default new NotesStorageService();
