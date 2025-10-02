import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_ENDPOINTS, makeApiRequest } from '../config/api';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('movie');
  const [hasSearched, setHasSearched] = useState(false);

  const searchTypes = [
    { label: 'Movies', value: 'movie' },
    { label: 'TV Shows', value: 'tv' },
    { label: 'Multi', value: 'multi' },
  ];

  const getEndpoint = (type) => {
    switch (type) {
      case 'movie':
        return API_ENDPOINTS.SEARCH_MOVIE;
      case 'tv':
        return API_ENDPOINTS.SEARCH_TV;
      case 'multi':
        return API_ENDPOINTS.SEARCH_MULTI;
      default:
        return API_ENDPOINTS.SEARCH_MOVIE;
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search query');
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      const endpoint = getEndpoint(searchType);
      const response = await makeApiRequest(endpoint, { 
        query: searchQuery.trim(),
        page: 1 
      });
      
      setSearchResults(response.results || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to search');
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSearchItem = ({ item }) => {
    const isMovie = item.media_type === 'movie' || searchType === 'movie';
    const title = isMovie ? item.title : item.name;
    const date = isMovie ? item.release_date : item.first_air_date;
    const type = item.media_type || searchType;

    return (
      <TouchableOpacity
        style={styles.searchItem}
        onPress={() => navigation.navigate('Details', { 
          id: item.id, 
          type: type,
          title: title 
        })}
      >
        <Image
          source={{
            uri: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : 'https://via.placeholder.com/150x225?text=No+Image'
          }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.searchInfo}>
          <Text style={styles.searchTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.searchType}>
            {type === 'movie' ? '🎬 Movie' : '📺 TV Show'}
          </Text>
          <Text style={styles.searchDate}>
            {date ? new Date(date).getFullYear() : 'N/A'}
          </Text>
          <Text style={styles.searchRating}>
            ⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
          </Text>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate('Details', { 
              id: item.id, 
              type: type,
              title: title 
            })}
          >
            <Text style={styles.detailsButtonText}>More Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#FF9500" />
          <Text style={styles.emptyText}>Searching...</Text>
        </View>
      );
    }

    if (hasSearched && searchResults.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubtext}>Try a different search term</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Enter a search query to get started</Text>
        <Text style={styles.emptySubtext}>Search for movies, TV shows, or both</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for movies or TV shows..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={searchType}
            style={styles.picker}
            onValueChange={setSearchType}
          >
            {searchTypes.map((type) => (
              <Picker.Item
                key={type.value}
                label={type.label}
                value={type.value}
              />
            ))}
          </Picker>
        </View>
      </View>

      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchItem}
          keyExtractor={(item) => `${item.id}-${item.media_type || searchType}`}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF9500',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  listContainer: {
    padding: 10,
  },
  searchItem: {
    flex: 1,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  poster: {
    width: '100%',
    height: 225,
  },
  searchInfo: {
    padding: 10,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  searchType: {
    fontSize: 12,
    color: '#FF9500',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  searchDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  searchRating: {
    fontSize: 14,
    color: '#FF9500',
    marginBottom: 10,
  },
  detailsButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default SearchScreen;
