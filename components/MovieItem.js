import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const MovieItem = ({
  item,
  onPress,
  type = "movie",
  buttonColor = "#007AFF",
}) => {
  const isMovie = type === "movie";
  const title = isMovie ? item.title : item.name;
  const date = isMovie ? item.release_date : item.first_air_date;
  const mediaType = item.media_type || type;

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onPress(item.id, mediaType, title)}
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
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {mediaType && (
          <Text style={[styles.type, { color: buttonColor }]}>
            {mediaType === "movie" ? "🎬 Movie" : "📺 TV Show"}
          </Text>
        )}

        <Text style={styles.date}>
          {date ? new Date(date).getFullYear() : "N/A"}
        </Text>

        <Text style={[styles.rating, { color: buttonColor }]}>
          ⭐ {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
        </Text>

        <TouchableOpacity
          style={[styles.detailsButton, { backgroundColor: buttonColor }]}
          onPress={() => onPress(item.id, mediaType, title)}
        >
          <Text style={styles.detailsButtonText}>More Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
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
  info: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  type: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: "bold",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    marginBottom: 10,
  },
  detailsButton: {
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
});

export default MovieItem;
