import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

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
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
});

export default SearchForm;
