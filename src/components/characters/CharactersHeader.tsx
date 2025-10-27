import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface Props {
  onNavigateToEpisodes: () => void;
  onOpenSettings: () => void;
}

export const CharactersHeader: React.FC<Props> = ({
  onNavigateToEpisodes,
  onOpenSettings,
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Characters</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onNavigateToEpisodes}>
          <Text style={styles.headerButtonText}>Movies</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={onOpenSettings}>
          <Text style={styles.headerIcon}>⚙</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    backgroundColor: '#0066CC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  headerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 18,
    color: '#333',
  },
});
