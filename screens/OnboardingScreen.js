import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { ImageBackground } from "react-native";
import { useFonts } from "expo-font";
import { Sora_400Regular } from "@expo-google-fonts/sora";

const OnboardingScreen = ({ navigation }) => {
  const {height} = Dimensions.get('window');
  const [fontsLoaded, fontError] = useFonts({ Sora_400Regular });
  if (!fontsLoaded && !fontError) {
    return null;
  } else {
    console.log("Fonts loaded");
  }

  return (
    <ImageBackground
      source={require("../assets/Onboarding.png")}
      style={styles.container}
    >
      <View style={{ flex: 1, justifyContent: "flex-end", width: '100%', rowGap: 50, }}>
        <Text
          style={[styles.soraRegular, {
            color: "white",
            fontSize: height * 0.05,
            textAlign: "center",
            marginBottom: 20,
          }]}
        >
          Guiding You Through Life's Challenges: Find Motivation and Thrive
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
          style={{
            marginBottom: 10,
            backgroundColor: "#C67C4E",
            justifyContent: "center",
            alignItems: "center",
            height: 62,
            borderRadius: 16,
          }}
        >
          <Text style={[styles.soraRegular, { color: "white", fontSize: 16 }]}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  soraRegular: {
    fontFamily: "Sora_400Regular",
  }
});

export default OnboardingScreen;
