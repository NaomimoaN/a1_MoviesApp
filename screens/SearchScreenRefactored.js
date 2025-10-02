import React, { useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";
import { API_ENDPOINTS, makeApiRequest } from "../config/api";
import MovieItem from "../components/MovieItem";
import SearchForm from "../components/SearchForm";
import { commonStyles, tabStyles } from "../styles/styles";

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState("movie");
  const [hasSearched, setHasSearched] = useState(false);

  const searchTypes = [
    { label: "Movies", value: "movie" },
    { label: "TV Shows", value: "tv" },
    { label: "Multi", value: "multi" },
  ];

  const getEndpoint = (type) => {
    switch (type) {
      case "movie":
        return API_ENDPOINTS.SEARCH_MOVIE;
      case "tv":
        return API_ENDPOINTS.SEARCH_TV;
      case "multi":
        return API_ENDPOINTS.SEARCH_MULTI;
      default:
        return API_ENDPOINTS.SEARCH_MOVIE;
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter a search query");
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      const endpoint = getEndpoint(searchType);
      const response = await makeApiRequest(endpoint, {
        query: searchQuery.trim(),
        page: 1,
      });

      setSearchResults(response.results || []);
    } catch (error) {
      Alert.alert("Error", "Failed to search");
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (id, type, title) => {
    navigation.navigate("Details", { id, type, title });
  };

  const renderSearchItem = ({ item }) => {
    const mediaType = item.media_type || searchType;
    return (
      <MovieItem
        item={item}
        onPress={handleItemPress}
        type={mediaType}
        buttonColor={tabStyles.search.buttonColor}
      />
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={commonStyles.emptyContainer}>
          <ActivityIndicator
            size="large"
            color={tabStyles.search.buttonColor}
          />
          <Text style={commonStyles.emptyText}>Searching...</Text>
        </View>
      );
    }

    if (hasSearched && searchResults.length === 0) {
      return (
        <View style={commonStyles.emptyContainer}>
          <Text style={commonStyles.emptyText}>No results found</Text>
          <Text style={commonStyles.emptySubtext}>
            Try a different search term
          </Text>
        </View>
      );
    }

    return (
      <View style={commonStyles.emptyContainer}>
        <Text style={commonStyles.emptyText}>
          Enter a search query to get started
        </Text>
        <Text style={commonStyles.emptySubtext}>
          Search for movies, TV shows, or both
        </Text>
      </View>
    );
  };

  return (
    <View style={commonStyles.container}>
      <View
        style={[
          commonStyles.header,
          { backgroundColor: tabStyles.search.headerColor },
        ]}
      >
        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchType={searchType}
          setSearchType={setSearchType}
          onSearch={handleSearch}
          searchTypes={searchTypes}
          headerColor={tabStyles.search.headerColor}
        />
      </View>

      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchItem}
          keyExtractor={(item) => `${item.id}-${item.media_type || searchType}`}
          numColumns={2}
          contentContainerStyle={commonStyles.listContainer}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
};

export default SearchScreen;
