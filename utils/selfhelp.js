import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "./supabase";

const GEN_AI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_KEY);

// Function to get details of sign in user
export const getSignedInUser = async () => {
  // Get user subscription status from async storage
  const storedUser = await AsyncStorage.getItem("user");
  const user = JSON.parse(storedUser);

  // Return the user object
  return user;
};

// Function to create chat directly from OpenAI API
export const customAIResponse = async (prompt) => {
  const model = GEN_AI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(prompt);
  const resp = result.response;

  const text = resp.text();
  console.log(text);

  const selfHelp = {
    question: prompt,
    answer: text,
  };

  return selfHelp;
};

export const continueChat = async (previousMessages, newMessage) => {
  // For text-only input, use the gemini-pro model
  const model = GEN_AI.getGenerativeModel({ model: "gemini-pro" });

  let modifiedMessages = [];

  previousMessages.forEach((msg) => {
    modifiedMessages.push({
      role: "user",
      parts: [{ text: msg.question }],
    });
    modifiedMessages.push({
      role: "model",
      parts: [{ text: msg.answer }],
    });
  });

  const chat = model.startChat({
    history: modifiedMessages,
  });

  const result = await chat.sendMessage(newMessage);
  const response = result.response;

  const text = response.text();
  return text;
};

export const useCredit = async (id, userCredits) => {
  const { data, error } = await supabase
    .from("users")
    .update({ credits: userCredits - 1 })
    .eq("id", id)
    .select();

  return data ? data : error;
};
