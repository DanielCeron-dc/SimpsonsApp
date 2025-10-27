import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Note} from '../../types';

interface Props {
  notes: Note[];
  showNoteForm: boolean;
  noteTitle: string;
  noteText: string;
  noteRating: number;
  onToggleForm: () => void;
  onNoteTitleChange: (text: string) => void;
  onNoteTextChange: (text: string) => void;
  onNoteRatingChange: (rating: number) => void;
  onSaveNote: () => void;
  onEditNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const CharacterNotesSection: React.FC<Props> = ({
  notes,
  showNoteForm,
  noteTitle,
  noteText,
  noteRating,
  onToggleForm,
  onNoteTitleChange,
  onNoteTextChange,
  onNoteRatingChange,
  onSaveNote,
  onEditNote,
  onDeleteNote,
}) => {
  return (
    <View style={styles.notesSection}>
      <View style={styles.notesSectionHeader}>
        <Text style={styles.sectionTitle}>My Notes</Text>
        <TouchableOpacity style={styles.addNoteButton} onPress={onToggleForm}>
          <Text style={styles.addNoteButtonText}>
            {showNoteForm ? 'Cancel' : '+ Add Note'}
          </Text>
        </TouchableOpacity>
      </View>

      {showNoteForm && (
        <View style={styles.noteForm}>
          <TextInput
            style={styles.input}
            placeholder="Note Title"
            value={noteTitle}
            onChangeText={onNoteTitleChange}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Note Text"
            value={noteText}
            onChangeText={onNoteTextChange}
            multiline
            numberOfLines={4}
          />
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Rating:</Text>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() => onNoteRatingChange(star)}>
                <Text style={styles.star}>
                  {star <= noteRating ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={onSaveNote}>
            <Text style={styles.saveButtonText}>Save Note</Text>
          </TouchableOpacity>
        </View>
      )}

      {notes.map(note => (
        <View key={note.id} style={styles.noteCard}>
          <Text style={styles.noteTitle}>{note.title}</Text>
          <Text style={styles.noteText}>{note.text}</Text>
          <View style={styles.noteRating}>
            {[...Array(note.rating)].map((_, i) => (
              <Text key={i} style={styles.noteStar}>
                ★
              </Text>
            ))}
          </View>
          <View style={styles.noteActions}>
            <TouchableOpacity onPress={() => onEditNote(note.id)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDeleteNote(note.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {notes.length === 0 && !showNoteForm && (
        <Text style={styles.emptyNotes}>No notes yet. Add one!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  notesSection: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  notesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addNoteButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addNoteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noteForm: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  star: {
    fontSize: 28,
    color: '#FFD700',
    marginHorizontal: 2,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noteCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  noteRating: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  noteStar: {
    fontSize: 16,
    color: '#FFD700',
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    color: '#0066CC',
    fontWeight: '600',
    marginRight: 15,
  },
  deleteButton: {
    color: '#F44336',
    fontWeight: '600',
  },
  emptyNotes: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 10,
  },
});
