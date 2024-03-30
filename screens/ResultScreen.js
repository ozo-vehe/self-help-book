import React, { useEffect, useState } from "react";
import {
  View,
  StatusBar,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import CustomHeader from "../components/CustomHeader";
import { FlatList } from "react-native";
import ResultCard from "../components/SelfHelpResultCard";
import { globalStyles } from "../components/styles/globalStyles";
import { supabase } from "../utils/supabase";
import { SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import selfHelpKeywords from "../utils/keywords";
import { getSignedInUser, continueChat, useCredit } from "../utils/selfhelp";
// import 'dotenv/config';

const ResultScreen = ({ route, navigation }) => {
  const chatId = route.params.chatId;
  const [user, setUser] = useState(null);
  const [chats, setData] = useState(route.params.result);
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(false);
  // Alert states
  const [warning, setWarning] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendIcon = "https://img.icons8.com/ios-glyphs/2F2D2C/30/sent.png";

  const addNewChat = async (newChat) => {
    const { data: chats } = await supabase
      .from("chats")
      .select("chat")
      .eq("id", chatId);

    const { error } = await supabase
      .from("chats")
      .update({ chat: [...chats[0].chat, newChat] })
      .eq("id", chatId);
  };

  const sendPrompt = async () => {
    console.log("sending...");
    setLoading(true);
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
          console.log("Contains self help keywords");
          // Send prompt request to the Google Generative AI API and get response
          const newAnswer = await continueChat(chats, prompt);

          const selfHelp = {
            question: prompt,
            answer: newAnswer,
          };
          console.log(selfHelp);

          // Create a new chat and save to supabase;
          await addNewChat(selfHelp);

          const editedUser = await useCredit(user.id, user.credits);
          // Set the user in local storage with updated credits
          await AsyncStorage.setItem("user", JSON.stringify(editedUser));

          setData([...chats, selfHelp]);
          console.log("sent");
        } else {
          // Display a response for non-self-help questions
          const nonSelfHelpResponse =
            "We can only provide answer to self help related questions.";

          Alert.alert("Sorry", nonSelfHelpResponse);
        }
      } else {
        Alert.alert("Hello, the prompt is empty. How can we be of help?");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPrompt(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = async () => {
      const user = await getSignedInUser();
      console.log("Result getting stored users...");
      console.log(user);
      setUser(user);
    };

    storedUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <CustomHeader title="Result" showIcon={false} />

      <View style={styles.resultContainer}>
        {chats.length > 0 ? (
          <FlatList
            data={chats}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => chats.indexOf(item).toString()}
            renderItem={({ item }) => <ResultCard result={item} />}
          />
        ) : (
          <Text>No results found</Text>
        )}
      </View>

      <View style={[globalStyles.inputContainer, styles.inputContainer]}>
        <View style={globalStyles.inputField}>
          <TextInput
            style={globalStyles.input}
            placeholder="How can we assist you today?"
            value={prompt}
            onChangeText={(text) => setPrompt(text)}
          />
          <TouchableOpacity
            onPress={sendPrompt}
            style={globalStyles.iconContainer}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#2F2D2C" />
            ) : (
              <Image source={{ uri: sendIcon }} style={globalStyles.icon} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  resultContainer: {
    paddingTop: 5,
    flex: 1,
    backgroundColor: "#F5F5F5",
    marginBottom: 80,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    paddingHorizontal: 30,
  },
});

export default ResultScreen;
