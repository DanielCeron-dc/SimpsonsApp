import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Character} from '../../types';
import simpsonsApiService from '../../services/simpsonsApiService';

interface Props {
  character: Character;
}

export const CharacterInfoCard: React.FC<Props> = ({character}) => {
  const imageUrl = simpsonsApiService.getImageUrl(character.portrait_path, '500');

  return (
    <View style={styles.content}>
      {imageUrl ? (
        <Image source={{uri: imageUrl}} style={styles.characterImage} />
      ) : (
        <View style={[styles.characterImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>?</Text>
        </View>
      )}

      <Text style={styles.name}>{character.name}</Text>

      {character.occupation && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Occupation:</Text>
          <Text style={styles.value}>{character.occupation}</Text>
        </View>
      )}

      {character.age && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{character.age}</Text>
        </View>
      )}

      {character.gender && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{character.gender}</Text>
        </View>
      )}

      {character.status && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Status:</Text>
          <Text
            style={[
              styles.value,
              character.status === 'Alive' && styles.statusAlive,
            ]}>
            {character.status}
          </Text>
        </View>
      )}

      {character.phrases && character.phrases.length > 0 && (
        <View style={styles.phrasesSection}>
          <Text style={styles.sectionTitle}>Famous Phrases:</Text>
          {character.phrases.slice(0, 5).map((phrase, index) => (
            <Text key={index} style={styles.phrase}>
              • {phrase}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  characterImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  placeholderImage: {
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 64,
    color: '#0066CC',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    width: 100,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  statusAlive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  phrasesSection: {
    width: '100%',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  phrase: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
});
