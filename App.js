import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

// Import screens
import MoviesScreen from "./screens/MoviesScreen";
import TVScreen from "./screens/TVScreenRefactored";
import SearchScreen from "./screens/SearchScreenRefactored";
import DetailsScreen from "./components/ShowPage";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Movies Tab
function MoviesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MoviesList"
        component={MoviesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator for TV Tab
function TVStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TVList"
        component={TVScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator for Search Tab
function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchList"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Movies") {
              iconName = focused ? "film" : "film-outline";
            } else if (route.name === "TV") {
              iconName = focused ? "tv" : "tv-outline";
            } else if (route.name === "Search") {
              iconName = focused ? "search" : "search-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "#e0e0e0",
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Movies"
          component={MoviesStack}
          options={{
            tabBarLabel: "Movies",
          }}
        />
        <Tab.Screen
          name="TV"
          component={TVStack}
          options={{
            tabBarLabel: "TV Shows",
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchStack}
          options={{
            tabBarLabel: "Search",
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
