import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { API_ENDPOINTS, makeApiRequest } from "../config/api";

const ShowPage = ({ route, navigation }) => {
  const { id, type, title } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [id, type]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const endpoint =
        type === "movie"
          ? API_ENDPOINTS.MOVIE_DETAILS(id)
          : API_ENDPOINTS.TV_DETAILS(id);

      const response = await makeApiRequest(endpoint);
      setDetails(response);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch details");
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load details</Text>
      </View>
    );
  }

  const isMovie = type === "movie";
  const displayTitle = isMovie ? details.title : details.name;
  const releaseDate = isMovie ? details.release_date : details.first_air_date;
  const runtime = isMovie ? details.runtime : details.episode_run_time?.[0];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{displayTitle}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.posterContainer}>
          <Image
            source={{
              uri: details.poster_path
                ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image",
            }}
            style={styles.poster}
            resizeMode="cover"
          />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{displayTitle}</Text>

          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>
              ⭐{" "}
              {details.vote_average ? details.vote_average.toFixed(1) : "N/A"}
            </Text>
            <Text style={styles.voteCount}>({details.vote_count} votes)</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {isMovie ? "Release Date:" : "First Air Date:"}
            </Text>
            <Text style={styles.infoValue}>{formatDate(releaseDate)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {isMovie ? "Runtime:" : "Episode Runtime:"}
            </Text>
            <Text style={styles.infoValue}>{formatRuntime(runtime)}</Text>
          </View>

          {!isMovie && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={styles.infoValue}>{details.status || "N/A"}</Text>
            </View>
          )}

          {details.genres && details.genres.length > 0 && (
            <View style={styles.genresContainer}>
              <Text style={styles.infoLabel}>Genres:</Text>
              <View style={styles.genresList}>
                {details.genres.map((genre, index) => (
                  <View key={genre.id} style={styles.genreTag}>
                    <Text style={styles.genreText}>{genre.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {details.overview && (
            <View style={styles.overviewContainer}>
              <Text style={styles.overviewTitle}>Overview</Text>
              <Text style={styles.overviewText}>{details.overview}</Text>
            </View>
          )}

          {details.production_companies &&
            details.production_companies.length > 0 && (
              <View style={styles.productionContainer}>
                <Text style={styles.infoLabel}>Production Companies:</Text>
                {details.production_companies
                  .slice(0, 3)
                  .map((company, index) => (
                    <Text key={company.id} style={styles.productionText}>
                      • {company.name}
                    </Text>
                  ))}
              </View>
            )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
  },
  header: {
    backgroundColor: "#007AFF",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    flexDirection: "row",
    padding: 20,
  },
  posterContainer: {
    marginRight: 20,
  },
  poster: {
    width: 150,
    height: 225,
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  rating: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "bold",
    marginRight: 10,
  },
  voteCount: {
    fontSize: 14,
    color: "#666",
  },
  infoRow: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#666",
  },
  genresContainer: {
    marginBottom: 15,
  },
  genresList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  genreTag: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 5,
  },
  genreText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  overviewContainer: {
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  overviewText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  productionContainer: {
    marginBottom: 20,
  },
  productionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
});

export default ShowPage;
