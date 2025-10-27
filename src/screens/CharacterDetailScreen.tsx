import React, {useEffect} from 'react';
import {Animated, ScrollView, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CharacterDetailHeader} from '../components/characterDetail/CharacterDetailHeader';
import {CharacterInfoCard} from '../components/characterDetail/CharacterInfoCard';
import {CharacterNotesManager} from '../components/characterDetail/CharacterNotesManager';
import {MainStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'CharacterDetail'>;

export const CharacterDetailScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const {character} = route.params;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [character.id, fadeAnim]);

  return (
    <View style={styles.container}>
      <CharacterDetailHeader onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content}>
        <Animated.View style={[styles.card, {opacity: fadeAnim}]}>
          <CharacterInfoCard character={character} />
        </Animated.View>

        <CharacterNotesManager characterId={character.id} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
});
