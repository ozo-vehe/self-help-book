import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { supabase } from "../utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 } from "uuid";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const [nameError, setNameError] = useState("");
  const [isPasswordVisibility, setIsPasswordVisibility] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisibility(!isPasswordVisibility);
  };

  // Check if input fields are empty or not
  const validateInput = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      setIsLoading(false);
      return false;
    }
    if (name.includes(" ")) {
      setNameError("Name can only be a single word.");
      setIsLoading(false);
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      setIsLoading(false);
      return false;
    }
    return true;
  };
  const handleSignUp = async () => {
    setIsLoading(true); // Set isLoading to true when signup starts
    const input_state = validateInput();
    console.log(`input: ${input_state}`);
    if (validateInput()) {
      try {
        // Save user to Supabase
        const { data, error } = await supabase
          .from("users")
          .insert([
            {
              id: v4(),
              name,
              email,
              password,
              subscribed: false,
            },
          ])
          .select();
        console.log(data);

        if(error) {
          console.log(error);
        }
        // Registration successful
        console.log("Registration successful", data);
        // Save user to local storage
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({ ...data[0], credits: 3 })
        );

        navigation.navigate("Subscription");
      } catch (error) {
        console.error("Error during registration", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          Alert.alert("Registration Failed", error.response.data.message);
        } else {
          Alert.alert(
            "Registration Error",
            "An error occurred during registration."
          );
        }
      } finally {
        setIsLoading(false);
        setName(null);
        setEmail(null);
        setPassword(null);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar />
      <Text style={[styles.mainText, isLoading && styles.fadeContainer]}>
        Sign Up
      </Text>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, isLoading && styles.fadeContainer]}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholderTextColor={"#bababa"}
              placeholder={"Username"}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (text.includes(" ")) {
                  setNameError("You can only use a single name");
                } else {
                  setNameError(null);
                }
              }}
            />
            {nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholderTextColor={"#bababa"}
              placeholder={"Email"}
              textContentType="emailAddress"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={{ flex: 1 }}
                placeholderTextColor={"#bababa"}
                textContentType="password"
                placeholder={"Password"}
                secureTextEntry={!isPasswordVisibility}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <AntDesign
                  name={isPasswordVisibility ? "eye" : "eyeo"}
                  size={20}
                  color={"#C67C4E"}
                  style={styles.passwordIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={{ flex: 1 }}
                placeholderTextColor={"#bababa"}
                placeholder={"Confirm password"}
                secureTextEntry={!confirmPasswordVisibility}
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
              />
              <TouchableOpacity
                onPress={() =>
                  setConfirmPasswordVisibility(!confirmPasswordVisibility)
                }
              >
                <AntDesign
                  name={confirmPasswordVisibility ? "eye" : "eyeo"}
                  size={20}
                  color={"#C67C4E"}
                  style={styles.passwordIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.loginContainer}>
            <Text style={styles.text1}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.text2}>Login</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
  },
  fadeContainer: {
    opacity: 0.6,
  },
  mainText: {
    color: "#C67C4E",
    fontFamily: "Sora_400Regular",
    fontSize: 34,
    fontWeight: "600",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },
  input: {
    fontFamily: "Sora_400Regular",
    color: "#2F2D2C",
    width: "100%",
    height: 56,
    borderWidth: 2,
    borderColor: "#EAEAEA",
    borderRadius: 14,
    paddingHorizontal: 20,
    fontWeight: "600",
    marginTop: 30,
  },
  errorText: {
    color: "#b80f0a",
    marginTop: 5,
    alignSelf: "flex-start",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#EAEAEA",
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 20,
    marginTop: 30,
    height: 56,
    width: "100%",
  },
  passwordIcon: {
    marginRight: 10,
  },
  loginContainer: {
    marginTop: 10,
    flexDirection: "row",
  },
  text1: {
    fontSize: 13,
    color: "#9B9B9B",
    fontFamily: "Sora_400Regular",
  },
  text2: {
    fontFamily: "Sora_400Regular",
    fontSize: 13,
    color: "#C67C4E",
    fontWeight: "700",
  },
  button: {
    width: "100%",
    height: 62,
    borderRadius: 16,
    backgroundColor: "#C67C4E",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Sora_400Regular",
    fontWeight: "600",
    color: "#fff",
  },
});
