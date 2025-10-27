import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, View, StyleSheet, Text} from 'react-native';
import {CharacterNotesSection} from './CharacterNotesSection';
import {useAuthStore} from '../../stores/authStore';
import {useNotesStore} from '../../stores/notesStore';

interface Props {
  characterId: number;
}

export const CharacterNotesManager: React.FC<Props> = ({characterId}) => {
  const {user} = useAuthStore();
  const {
    notes,
    loadNotesByCharacter,
    createNote,
    updateNote,
    deleteNote,
  } = useNotesStore();

  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [noteRating, setNoteRating] = useState(5);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadNotesByCharacter(user.id, characterId);
    }
  }, [characterId, loadNotesByCharacter, user]);

  const resetForm = useCallback(() => {
    setNoteTitle('');
    setNoteText('');
    setNoteRating(5);
    setEditingNoteId(null);
  }, []);

  const handleToggleNoteForm = useCallback(() => {
    if (showNoteForm) {
      resetForm();
      setShowNoteForm(false);
      return;
    }
    resetForm();
    setShowNoteForm(true);
  }, [resetForm, showNoteForm]);

  const handleSaveNote = useCallback(async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save notes');
      return;
    }

    if (!noteTitle.trim() || !noteText.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      if (editingNoteId) {
        await updateNote(user.id, editingNoteId, {
          title: noteTitle,
          text: noteText,
          rating: noteRating,
        });
        Alert.alert('Success', 'Note updated successfully');
      } else {
        await createNote(user.id, {
          characterId,
          title: noteTitle,
          text: noteText,
          rating: noteRating,
        });
        Alert.alert('Success', 'Note created successfully');
      }

      setShowNoteForm(false);
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
    }
  }, [
    characterId,
    createNote,
    editingNoteId,
    noteRating,
    noteText,
    noteTitle,
    resetForm,
    updateNote,
    user,
  ]);

  const handleEditNote = useCallback(
    (noteId: string) => {
      const note = notes.find(n => n.id === noteId);
      if (!note) {
        return;
      }
      setNoteTitle(note.title);
      setNoteText(note.text);
      setNoteRating(note.rating);
      setEditingNoteId(noteId);
      setShowNoteForm(true);
    },
    [notes],
  );

  const handleDeleteNote = useCallback(
    (noteId: string) => {
      if (!user) {
        Alert.alert('Error', 'You must be logged in to delete notes');
        return;
      }

      Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(user.id, noteId);
              Alert.alert('Success', 'Note deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ]);
    },
    [deleteNote, user],
  );

  const notesForCharacter = useMemo(() => {
    return notes.filter(note => note.characterId === characterId);
  }, [characterId, notes]);

  if (!user) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Login to add personal notes for this character.
        </Text>
      </View>
    );
  }

  return (
    <CharacterNotesSection
      notes={notesForCharacter}
      showNoteForm={showNoteForm}
      noteTitle={noteTitle}
      noteText={noteText}
      noteRating={noteRating}
      onToggleForm={handleToggleNoteForm}
      onNoteTitleChange={setNoteTitle}
      onNoteTextChange={setNoteText}
      onNoteRatingChange={setNoteRating}
      onSaveNote={handleSaveNote}
      onEditNote={handleEditNote}
      onDeleteNote={handleDeleteNote}
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
