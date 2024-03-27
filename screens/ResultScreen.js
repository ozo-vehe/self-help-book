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
import selfHelpKeywords from "../utils/selfhelpkeywords";
import { getSignedInUser } from "../utils/uitls";
// import 'dotenv/config';

const ResultScreen = ({ route, navigation }) => {
  const chatId = route.params.chatId;
  const [user, setUser] = useState(null);
  const [data, setData] = useState(route.params.result);
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(false);
  // Alert states
  const [warning, setWarning] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendIcon = "https://img.icons8.com/ios-glyphs/2F2D2C/30/sent.png";
  const baseUrl = "https://spitfire-interractions.onrender.com/";

  // Bypassed AI Url to use for demo
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

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


  const customAi = async () => {
    const request = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 1024,
        temperature: 0.9,
      }),
    });

    const response = await request.json();

    const selfHelp = {
      question: prompt,
      answer: response.choices[0].text,
    };
    console.log("Cusotom");
    console.log(selfHelp);

    return selfHelp;
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
        if (user.credits <= 0 && user.subscribed === false) {
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
          // Set the self help variable
          let selfHelp;
          // Send prompt request to the chatgpt API using the backend API
          if (user.subscribed === false) {
            const req = await fetch(`${baseUrl}/api/chat/completions`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                history: data,
                user_input: prompt,
              }),
            });
            console.log(req);
            const response = await req.json();

            if (
              response.content &&
              response.content ==
                "The server is experiencing a high volume of requests. Please try again later."
            ) {
              Alert.alert(
                "Sorry",
                "The server is experiencing a high volume of requests. Please try again later.",
                [
                  {
                    text: "Contiue with alternative",
                    onPress: async () => {
                      selfHelp = await customAi();
                      console.log(selfHelp);
                      // Create a new chat and save to supabase;
                      await addNewChat(selfHelp);
                      const currentCredits = user.credits - 1;
                      setUser({ ...user, credits: currentCredits });
                      setData([...data, selfHelp]);
                      console.log("sent");
                    },
                  },
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                ]
              );
              return;
            } else if (
              response.message &&
              response.message.includes("Invalid request")
            ) {
              Alert.alert("Sorry, invalid request");
              return;
            } else {
              console.log(response);
              // Create a response variable called selfHelp to hold both the question and the result
              selfHelp = {
                question: prompt,
                answer: response.message,
              };
              console.log("Line 179");
              console.log(selfHelp);
              // Create a new chat and save to supabase;
              await addNewChat(selfHelp);
              const currentCredits = user.credits - 1;
              setUser({ ...user, credits: currentCredits });
              setData([...data, selfHelp]);
              console.log("sent");
            }
          } else if (user.subscribed === true) {
            selfHelp = await customAi();

            // Create a new chat and save to supabase;
            await addNewChat(selfHelp);
            const currentCredits = user.credits - 1;
            setUser({ ...user, credits: currentCredits });
            setData([...data, selfHelp]);
            console.log("sent");
          }
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
    getSignedInUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <CustomHeader title="Result" showIcon={false} />

      <View style={styles.resultContainer}>
        {data.length > 0 ? (
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => data.indexOf(item).toString()}
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
