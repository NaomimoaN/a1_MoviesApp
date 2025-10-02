import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const Pagination = ({ loading, hasMore = false }) => {
  if (!loading && !hasMore) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default Pagination;
