import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  StatusBar,
  Alert,
  ActivityIndicator,
  Dimensions,
  Keyboard,
  SafeAreaView,
  TextInput,
} from "react-native";
import { globalStyles } from "../components/styles/globalStyles";
import { supabase } from "../utils/supabase";
import uuid from "react-native-uuid";
import selfHelpKeywords from "../utils/keywords";
import { useFocusEffect } from "@react-navigation/native";
import { getSignedInUser, customAIResponse, useCredit } from "../utils/selfhelp";
import CustomAlert from "../components/alerts/Alert";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  // Get the height and width of the mobile device
  const { height } = Dimensions.get("window");
  // Variable to hold signed in user
  const [user, setUser] = useState(null);
  // Set loading state
  const [loading, setLoading] = useState(false);
  // Store the user input as prompt
  const [prompt, setPrompt] = useState(null);
  // Alert states
  const [alert, setAlert] = useState(false)
  const [alertTitle, setAlertTitle] = useState(null)
  const [alertMessage, setAlertMessage] = useState(null)

  // Send icon
  const sendIcon = "https://img.icons8.com/ios-glyphs/2F2D2C/30/sent.png";

  // Function to create a new chat
  const saveChat = async (id, newChat) => {
    await supabase
      .from("chats")
      .insert([{ id: id, chat: [newChat], user_id: user.id }])
      .select();
  };


  const sendPrompt = async () => {
    console.log("sending...");
    setLoading(true);
    const chatId = uuid.v4();
    try {
      // Check if prompt is empty or not
      if (prompt) {
        // Check if the prompt contains keywords related to self-help
        const containsSelfHelpKeywords = selfHelpKeywords.some((keyword) =>
          prompt.toLowerCase().includes(keyword.toLowerCase())
        );

        // Check if the user has any credits left
        if (user.credits <= 0) {
          Alert.alert(
            "Sorry",
            "You have no credits left, please buy more credits to continue using the app",
            [
              {
                text: "Buy Credits",
                onPress: () => navigation.navigate("Subscription"),
              },
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
            ]
          );
          return;
        }

        if (containsSelfHelpKeywords) {
          // If the user is subscribed, send prompt request to the OpenAI API
          if (user.credits > 0) {
            // Send prompt request to the Googel Generative AI API
            const selfHelp = await customAIResponse(prompt);
            // Deduct a credit from the user's account
            const editedUser = await useCredit(user.id, user.credits);
            // Set the user in local storage with updated credits
            await AsyncStorage.setItem("user", JSON.stringify(editedUser));
            
            // // Create a new chat and save to supabase;
            await saveChat(chatId, selfHelp);
            // Navigate to the result screen and send the selfHelp variable
            navigation.navigate("Results", { result: [selfHelp], chatId });
            console.log("sent");
          } else {
            console.log('credits not enough');
          }
        } else {
          // Display a response for non-self-help questions
          const nonSelfHelpResponse = "We can only provide answer to questions related to self help and improvement.";

          Alert.alert("Sorry", nonSelfHelpResponse);
        }
      } else {
        Alert.alert("Hello, the prompt is empty how can we be of help");
      }
    } catch (error) {
      console.log(`error: ${error}`);
      Alert.alert("Error", `${error}`);
    } finally {
      console.log(user);
      setPrompt(null);
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        const currentUser = await getSignedInUser();
        setUser(currentUser);
      }
      fetchUser();
    }, []) // Empty dependency array to ensure it runs only on screen focus
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      {alert && (<CustomAlert message={alertMessage} title={alertTitle} />)}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.homeTextContainer}>
          <Text style={[styles.homeText, { fontSize: height * 0.05 }]}>
            Share your thoughts, goals, or concerns, and let's start this
            journey together
          </Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={globalStyles.inputContainer}>
        <View style={globalStyles.inputField}>
          <TextInput
            style={globalStyles.input}
            value={prompt}
            placeholder="How can we assist you today?"
            onChangeText={(text) => setPrompt(text)}
          />
          <TouchableWithoutFeedback
            onPress={sendPrompt}
            style={globalStyles.iconContainer}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#2F2D2C" />
            ) : (
              <Image source={{ uri: sendIcon }} style={globalStyles.icon} />
            )}
          </TouchableWithoutFeedback>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#F1F1F1",
    alignItems: "center",
    rowGap: 50,
    justifyContent: "flex-end",
    paddingHorizontal: 30,
  },
  homeText: {
    textAlign: "center",
    color: "#C67C4E",
    fontFamily: "Sora_600SemiBold",
  },
});
