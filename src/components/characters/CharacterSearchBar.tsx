import React, {memo} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

interface Props {
  value: string;
  onChange: (text: string) => void;
  onSearch: () => void;
}

export const CharacterSearchBar = memo<Props>(({value, onChange, onSearch}) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search characters..."
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSearch}
        returnKeyType="search"
      />
      <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
});

CharacterSearchBar.displayName = 'CharacterSearchBar';

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  searchButton: {
    backgroundColor: '#0066CC',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
