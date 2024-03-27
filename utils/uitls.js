import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";

// Constant to hold the base url of the backend API
const BASE_URL = "https://spitfire-interractions.onrender.com/";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Function to sign up user
export const signup = (async) => {
  console.log("signup");
};

// Function to login a user
export const login = (async) => {
  console.log("login");
};

// Function to get details of sign in user
export const getSignedInUser = async () => {
  // Get user subscription status from async storage
  const storedUser = await AsyncStorage.getItem("user");
  const user = JSON.parse(storedUser);

  // Return the user object
  return user;
};

// Function to create a new chat
export const backendAIResponse = async (prompt) => {
  const req = await fetch(`${BASE_URL}/api/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_input: prompt,
    }),
  });
  const response = await req.json();
  console.log(response)

  if (response.content && response.content == "The server is experiencing a high volume of requests. Please try again later.") {
    return "Server error";
  } else if (response.message && response.message.includes("Invalid request")) {
    return "invalid request";
  } else {
    // Create a response variable called selfHelp to hold both the question and the result
    // This will be sent to the result screen
    const selfHelp = {
      question: prompt,
      answer: response.message && response.message,
    };
     return selfHelp;
  }
};

// Function to create chat directly from OpenAI API
export const customAIResponse = async (prompt) => {
  const request = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
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

  return selfHelp;
}