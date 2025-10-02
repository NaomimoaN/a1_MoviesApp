import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import CustomDropdown from "./CustomDropdown";

const SearchForm = ({
  searchQuery,
  setSearchQuery,
  searchType,
  setSearchType,
  onSearch,
  searchTypes = [
    { label: "Movies", value: "movie" },
    { label: "TV Shows", value: "tv" },
    { label: "Multi", value: "multi" },
  ],
  headerColor = "#FF9500",
}) => {
  const handleSearchTypeChange = (type) => {
    console.log("Search type changed to:", type);
    setSearchType(type);
  };
  return (
    <View style={styles.container}>
      <Text style={[styles.headerTitle, { color: "white" }]}>Search</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for movies or TV shows..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: headerColor }]}
          onPress={onSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <CustomDropdown
        options={searchTypes}
        selectedValue={searchType}
        onValueChange={handleSearchTypeChange}
        style={styles.pickerContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
    fontSize: 16,
  },
  searchButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  pickerContainer: {
    marginTop: 0,
  },
});

export default SearchForm;
