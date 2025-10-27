import React, {memo, useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {Episode} from '../../types';

interface Props {
  episode: Episode;
  index: number;
}

export const EpisodeListItem = memo<Props>(({episode, index}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    const animation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 30,
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [fadeAnim, index, episode.id]);

  return (
    <Animated.View style={[styles.episodeCard, {opacity: fadeAnim}]}>
      <View style={styles.episodeHeader}>
        <Text style={styles.episodeNumber}>
          S{episode.season} E{episode.episode_number}
        </Text>
        {episode.air_date && (
          <Text style={styles.airDate}>{episode.air_date}</Text>
        )}
      </View>
      <Text style={styles.episodeTitle}>{episode.title}</Text>
      {episode.synopsis && (
        <Text style={styles.synopsis} numberOfLines={3}>
          {episode.synopsis}
        </Text>
      )}
    </Animated.View>
  );
});

EpisodeListItem.displayName = 'EpisodeListItem';

const styles = StyleSheet.create({
  episodeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  episodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  episodeNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  airDate: {
    fontSize: 12,
    color: '#999',
  },
  episodeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  synopsis: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
