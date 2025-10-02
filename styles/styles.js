import { StyleSheet } from "react-native";

// Common colors
export const colors = {
  primary: "#007AFF",
  secondary: "#34C759",
  accent: "#FF9500",
  background: "#f5f5f5",
  white: "#ffffff",
  black: "#000000",
  gray: "#666666",
  lightGray: "#e0e0e0",
  darkGray: "#333333",
};

// Common spacing
export const spacing = {
  xs: 5,
  sm: 10,
  md: 15,
  lg: 20,
  xl: 25,
  xxl: 30,
};

// Common font sizes
export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
};

// Common styles
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: spacing.md,
  },
  pickerContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  picker: {
    height: 50,
    color: colors.black,
    backgroundColor: colors.white,
  },
  listContainer: {
    padding: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: fontSizes.md,
    color: colors.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize: fontSizes.lg,
    color: colors.gray,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: fontSizes.sm,
    color: colors.gray,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: fontSizes.xs,
  },
});

// Tab-specific styles
export const tabStyles = {
  movies: {
    headerColor: colors.primary,
    buttonColor: colors.primary,
  },
  tv: {
    headerColor: colors.secondary,
    buttonColor: colors.secondary,
  },
  search: {
    headerColor: colors.accent,
    buttonColor: colors.accent,
  },
};

export default {
  colors,
  spacing,
  fontSizes,
  commonStyles,
  tabStyles,
};
