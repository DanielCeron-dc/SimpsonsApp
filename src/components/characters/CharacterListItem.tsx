import React, {memo, useCallback, useEffect, useRef} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Character} from '../../types';
import simpsonsApiService from '../../services/simpsonsApiService';

interface Props {
  character: Character;
  index: number;
  onPress: (character: Character) => void;
}

export const CharacterListItem = memo<Props>(({character, index, onPress}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const hasAnimated = useRef(false);
  const previousCharacterId = useRef<number | null>(null);

  useEffect(() => {
    const isSameCharacter = previousCharacterId.current === character.id;

    if (hasAnimated.current && isSameCharacter) {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
      return;
    }

    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    hasAnimated.current = true;
    previousCharacterId.current = character.id;

    const animation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        delay: index * 40,
        useNativeDriver: true,
      }),
    ]);

    animation.start();
    return () => animation.stop();
  }, [fadeAnim, slideAnim, index, character.id]);

  const imageUrl = simpsonsApiService.getImageUrl(character.portrait_path, '200');

  const handlePress = useCallback(() => {
    onPress(character);
  }, [onPress, character]);

  return (
    <Animated.View
      style={[
        styles.characterCard,
        {
          opacity: fadeAnim,
          transform: [{translateY: slideAnim}],
        },
      ]}>
      <TouchableOpacity style={styles.characterContent} onPress={handlePress}>
        {imageUrl ? (
          <Image source={{uri: imageUrl}} style={styles.characterImage} />
        ) : (
          <View style={[styles.characterImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>?</Text>
          </View>
        )}
        <View style={styles.characterInfo}>
          <Text style={styles.characterName} numberOfLines={1}>
            {character.name}
          </Text>
          {character.occupation && (
            <Text style={styles.characterOccupation} numberOfLines={1}>
              {character.occupation}
            </Text>
          )}
          {character.status && (
            <Text
              style={[
                styles.characterStatus,
                character.status === 'Alive' && styles.statusAlive,
              ]}>
              {character.status}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

CharacterListItem.displayName = 'CharacterListItem';

const styles = StyleSheet.create({
  characterCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  characterContent: {
    flexDirection: 'row',
    padding: 15,
  },
  characterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  placeholderImage: {
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    color: '#0066CC',
    fontWeight: 'bold',
  },
  characterInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  characterOccupation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  characterStatus: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  statusAlive: {
    color: '#4CAF50',
  },
});
