import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Episode} from '../types';
import simpsonsApiService from '../services/simpsonsApiService';
import {EpisodesHeader} from '../components/episodes/EpisodesHeader';
import {EpisodeListItem} from '../components/episodes/EpisodeListItem';
import {useSettingsModal} from '../contexts/SettingsModalContext';
import {MainStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Episodes'>;

export const EpisodesScreen: React.FC<Props> = ({navigation}) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const {openSettings} = useSettingsModal();

  useEffect(() => {
    loadEpisodes(1);
  }, []);

  const loadEpisodes = async (pageNum: number) => {
    if (pageNum === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const data = await simpsonsApiService.getEpisodes(pageNum);

      if (pageNum === 1) {
        setEpisodes(data);
      } else {
        setEpisodes(prev => [...prev, ...data]);
      }

      setHasMore(data.length === 20);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading episodes:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      loadEpisodes(page + 1);
    }
  };

  const renderEpisode = useCallback(
    ({item, index}: {item: Episode; index: number}) => (
      <EpisodeListItem episode={item} index={index} />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <EpisodesHeader
        onNavigateToCharacters={() => navigation.goBack()}
        onOpenSettings={openSettings}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      ) : (
        <FlatList
          data={episodes}
          renderItem={renderEpisode}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator
                size="small"
                color="#0066CC"
                style={styles.footerLoader}
              />
            ) : null
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
});
