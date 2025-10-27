import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface Props {
  onNavigateToCharacters: () => void;
  onOpenSettings: () => void;
}

export const EpisodesHeader: React.FC<Props> = ({
  onNavigateToCharacters,
  onOpenSettings,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onNavigateToCharacters}
        style={styles.backButton}>
        <Text style={styles.backButtonText}>← Characters</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Movies</Text>
      <TouchableOpacity style={styles.settingsButton} onPress={onOpenSettings}>
        <Text style={styles.settingsIcon}>⚙</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 12,
  },
  backButtonText: {
    color: '#0066CC',
    fontSize: 14,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 18,
    color: '#333',
  },
});
