import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API_ENDPOINTS, makeApiRequest } from "../config/api";
import MovieItem from "../components/MovieItem";
import Pagination from "../components/Pagination";
import { commonStyles, tabStyles } from "../styles/styles";

const TVScreen = ({ navigation }) => {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("airing_today");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const tvCategories = [
    { label: "Airing Today", value: "airing_today" },
    { label: "On The Air", value: "on_the_air" },
    { label: "Popular", value: "popular" },
    { label: "Top Rated", value: "top_rated" },
  ];

  const getEndpoint = (category) => {
    switch (category) {
      case "airing_today":
        return API_ENDPOINTS.TV_AIRING_TODAY;
      case "on_the_air":
        return API_ENDPOINTS.TV_ON_THE_AIR;
      case "popular":
        return API_ENDPOINTS.TV_POPULAR;
      case "top_rated":
        return API_ENDPOINTS.TV_TOP_RATED;
      default:
        return API_ENDPOINTS.TV_AIRING_TODAY;
    }
  };

  const fetchTVShows = async (category = selectedCategory, pageNum = 1) => {
    try {
      setLoading(true);
      const endpoint = getEndpoint(category);
      const response = await makeApiRequest(endpoint, { page: pageNum });

      if (pageNum === 1) {
        setTvShows(response.results);
      } else {
        setTvShows((prev) => [...prev, ...response.results]);
      }

      setTotalPages(response.total_pages);
      setPage(pageNum);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch TV shows");
      console.error("Error fetching TV shows:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTVShows();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
    fetchTVShows(category, 1);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      fetchTVShows(selectedCategory, page + 1);
    }
  };

  const handleItemPress = (id, type, title) => {
    navigation.navigate("Details", { id, type, title });
  };

  const renderTVItem = ({ item }) => (
    <MovieItem
      item={item}
      onPress={handleItemPress}
      type="tv"
      buttonColor={tabStyles.tv.buttonColor}
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
          { backgroundColor: tabStyles.tv.headerColor },
        ]}
      >
        <Text style={commonStyles.headerTitle}>TV Shows</Text>
        <View style={commonStyles.pickerContainer}>
          <Picker
            selectedValue={selectedCategory}
            style={commonStyles.picker}
            onValueChange={handleCategoryChange}
          >
            {tvCategories.map((category) => (
              <Picker.Item
                key={category.value}
                label={category.label}
                value={category.value}
              />
            ))}
          </Picker>
        </View>
      </View>

      {loading && tvShows.length === 0 ? (
        <View style={commonStyles.loadingContainer}>
          <ActivityIndicator size="large" color={tabStyles.tv.buttonColor} />
          <Text style={commonStyles.loadingText}>Loading TV shows...</Text>
        </View>
      ) : (
        <FlatList
          data={tvShows}
          renderItem={renderTVItem}
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

export default TVScreen;
