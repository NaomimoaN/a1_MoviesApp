import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";
import { API_ENDPOINTS, makeApiRequest } from "../config/api";
import MovieItem from "../components/MovieItem";
import Pagination from "../components/Pagination";
import CustomDropdown from "../components/CustomDropdown";
import { commonStyles, tabStyles } from "../styles/styles";

const MoviesScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("now_playing");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const movieCategories = [
    { label: "Now Playing", value: "now_playing" },
    { label: "Popular", value: "popular" },
    { label: "Top Rated", value: "top_rated" },
    { label: "Upcoming", value: "upcoming" },
  ];

  const getEndpoint = (category) => {
    switch (category) {
      case "now_playing":
        return API_ENDPOINTS.MOVIES_NOW_PLAYING;
      case "popular":
        return API_ENDPOINTS.MOVIES_POPULAR;
      case "top_rated":
        return API_ENDPOINTS.MOVIES_TOP_RATED;
      case "upcoming":
        return API_ENDPOINTS.MOVIES_UPCOMING;
      default:
        return API_ENDPOINTS.MOVIES_NOW_PLAYING;
    }
  };

  const fetchMovies = async (category = selectedCategory, pageNum = 1) => {
    try {
      setLoading(true);
      const endpoint = getEndpoint(category);
      console.log(
        "Fetching movies for category:",
        category,
        "endpoint:",
        endpoint
      );
      const response = await makeApiRequest(endpoint, { page: pageNum });

      if (pageNum === 1) {
        setMovies(response.results);
      } else {
        setMovies((prev) => [...prev, ...response.results]);
      }

      setTotalPages(response.total_pages);
      setPage(pageNum);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch movies");
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleCategoryChange = (category) => {
    console.log("Category changed to:", category);
    setSelectedCategory(category);
    setPage(1);
    fetchMovies(category, 1);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      fetchMovies(selectedCategory, page + 1);
    }
  };

  const handleItemPress = (id, type, title) => {
    navigation.navigate("Details", { id, type, title });
  };

  const renderMovieItem = ({ item }) => (
    <MovieItem
      item={item}
      onPress={handleItemPress}
      type="movie"
      buttonColor={tabStyles.movies.buttonColor}
    />
  );

  const renderFooter = () => (
    <Pagination loading={loading} hasMore={page < totalPages} />
  );

  return (
    <View style={commonStyles.container}>
      <View
        style={[
          commonStyles.header,
          { backgroundColor: tabStyles.movies.headerColor },
        ]}
      >
        <Text style={commonStyles.headerTitle}>Movies</Text>
        <CustomDropdown
          options={movieCategories}
          selectedValue={selectedCategory}
          onValueChange={handleCategoryChange}
          style={commonStyles.pickerContainer}
        />
      </View>

      {loading && movies.length === 0 ? (
        <View style={commonStyles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={tabStyles.movies.buttonColor}
          />
          <Text style={commonStyles.loadingText}>Loading movies...</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={commonStyles.listContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

// Styles are now imported from common styles

export default MoviesScreen;
