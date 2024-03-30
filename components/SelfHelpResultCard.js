import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  useFonts,
  Sora_400Regular,
  Sora_300Light,
} from "@expo-google-fonts/sora";
import Markdown from "react-native-markdown-display";

// Pass a prop called result and category to this component
// the category refers to either a question or a response to the question
const ResultCard = ({ result }) => {
  const [fontsLoaded, fontError] = useFonts({ Sora_400Regular, Sora_300Light });

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{result.question}</Text>
      <View style={styles.answer}>
        <Markdown style={markdownStyles}>{result.answer}</Markdown>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    marginVertical: 20,
    paddingHorizontal: 30,
  },
  question: {
    borderWidth: 1,
    borderColor: "#bababa",
    fontSize: 13,
    fontWeight: "600",
    color: "#2F2D2C",
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
    fontFamily: "Sora_400Regular",
  },
  answer: {
    height: "auto",
    backgroundColor: "#C67C4E",
    padding: 10,
    borderRadius: 4,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    color: "#F5F5F5",
    fontFamily: "Sora_300Light",
    fontSize: 13,
    lineHeight: 18,
  },
});

export default ResultCard;
