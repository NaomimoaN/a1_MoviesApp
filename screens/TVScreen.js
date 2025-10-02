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

  const renderTVItem = ({ item }) => (
    <TouchableOpacity
      style={styles.tvItem}
      onPress={() =>
        navigation.navigate("Details", {
          id: item.id,
          type: "tv",
          title: item.name,
        })
      }
    >
      <Image
        source={{
          uri: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : "https://via.placeholder.com/150x225?text=No+Image",
        }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.tvInfo}>
        <Text style={styles.tvTitle} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.tvDate}>
          {item.first_air_date
            ? new Date(item.first_air_date).getFullYear()
            : "N/A"}
        </Text>
        <Text style={styles.tvRating}>
          ⭐ {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
        </Text>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() =>
            navigation.navigate("Details", {
              id: item.id,
              type: "tv",
              title: item.name,
            })
          }
        >
          <Text style={styles.detailsButtonText}>More Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TV Shows</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCategory}
            style={styles.picker}
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34C759" />
          <Text style={styles.loadingText}>Loading TV shows...</Text>
        </View>
      ) : (
        <FlatList
          data={tvShows}
          renderItem={renderTVItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#34C759",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  listContainer: {
    padding: 10,
  },
  tvItem: {
    flex: 1,
    margin: 5,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  poster: {
    width: "100%",
    height: 225,
  },
  tvInfo: {
    padding: 10,
  },
  tvTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  tvDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  tvRating: {
    fontSize: 14,
    color: "#34C759",
    marginBottom: 10,
  },
  detailsButton: {
    backgroundColor: "#34C759",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  detailsButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default TVScreen;
