import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import { useFonts, Sora_400Regular, Sora_300Light, } from "@expo-google-fonts/sora";

// Pass a prop called result and category to this component
// the category refers to either a question or a response to the question
const ResultCard = ({result}) => {
  const [fontsLoaded, fontError] = useFonts({ Sora_400Regular, Sora_300Light });

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{result.question}</Text>
      <Text style={styles.answer}>{result.answer.trim()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    marginVertical: 20,
    paddingHorizontal: 30,
  },
  question: {
    borderWidth: 1,
    borderColor: '#bababa',
    fontSize: 13,
    fontWeight: "600",
    color: "#2F2D2C",
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
    fontFamily: 'Sora_400Regular',
  },
  answer: {
    fontFamily: 'Sora_300Light',
    fontSize: 12,
    lineHeight: 18,
    color: "#F5F5F5",
    backgroundColor: "#C67C4E",
    padding: 15,
    borderRadius: 4,
  }
})

export default ResultCard;
