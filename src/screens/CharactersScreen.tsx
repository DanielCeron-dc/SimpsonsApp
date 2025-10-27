import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Character} from '../types';
import simpsonsApiService from '../services/simpsonsApiService';
import {CharactersHeader} from '../components/characters/CharactersHeader';
import {CharacterSearchBar} from '../components/characters/CharacterSearchBar';
import {CharacterListItem} from '../components/characters/CharacterListItem';
import {useSettingsModal} from '../contexts/SettingsModalContext';
import {MainStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Characters'>;

export const CharactersScreen: React.FC<Props> = ({navigation}) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const activeRequestId = useRef(0);
  const {openSettings} = useSettingsModal();

  const loadCharacters = useCallback(
    async (pageNum: number, search?: string) => {
      const requestId = ++activeRequestId.current;
      const trimmedSearch = search?.trim() ?? '';

      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        if (trimmedSearch) {
          const data = await simpsonsApiService.searchCharacters(trimmedSearch);
          if (__DEV__) {
            console.log('Loaded search results:', data.length);
          }

          if (activeRequestId.current !== requestId) {
            return;
          }

          setCharacters(data);
          setHasMore(false);
          setPage(1);
        } else {
          const data = await simpsonsApiService.getCharacters(pageNum);
          if (__DEV__) {
            console.log('Loaded characters:', data.length);
          }

          if (activeRequestId.current !== requestId) {
            return;
          }

          if (pageNum === 1) {
            setCharacters(data);
          } else {
            setCharacters(prev => [...prev, ...data]);
          }

          setHasMore(data.length === 20);
          setPage(pageNum);
        }
      } catch (error) {
        console.error('Error loading characters:', error);
      } finally {
        if (activeRequestId.current === requestId) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    loadCharacters(1);
  }, [loadCharacters]);

  const handleSearch = useCallback(() => {
    setPage(1);
    setHasMore(true);
    loadCharacters(1, searchQuery);
  }, [searchQuery, loadCharacters]);

  const handleLoadMore = () => {
    if (searchQuery.trim()) {
      return;
    }
    if (!isLoadingMore && hasMore) {
      loadCharacters(page + 1, searchQuery);
    }
  };

  const handleCharacterPress = useCallback(
    (character: Character) => {
      navigation.navigate('CharacterDetail', {character});
    },
    [navigation],
  );

  const handleNavigateToEpisodes = useCallback(() => {
    navigation.navigate('Episodes');
  }, [navigation]);

  const renderCharacter = useCallback(
    ({item, index}: {item: Character; index: number}) => (
      <CharacterListItem
        character={item}
        index={index}
        onPress={handleCharacterPress}
      />
    ),
    [handleCharacterPress],
  );

  return (
    <View style={styles.container}>
      <CharactersHeader
        onNavigateToEpisodes={handleNavigateToEpisodes}
        onOpenSettings={openSettings}
      />
      <CharacterSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      ) : (
        <FlatList
          data={characters}
          renderItem={renderCharacter}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size="small" color="#0066CC" style={styles.footerLoader} />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No characters found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoader: {
    marginVertical: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
