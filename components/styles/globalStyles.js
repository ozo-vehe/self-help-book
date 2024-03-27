import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "#F5F5F5",
    paddingTop: 10,
    width: "100%",
  },
  inputField: {
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "#BABABA",
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  input: {
    color: "#2F2D2C",
    flex: 1
  },
  iconContainer: {
    width: 24,
    height: 24,
  },
  icon: {
    width: 24,
    height: 24,
    borderWidth: 1,
  },
});