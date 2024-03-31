import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native";
import { Text, View } from "react-native";
import CustomHeader from "../components/CustomHeader";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({name: 'user', email: 'email@gmail.com'});

  const handleLogout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.clear();
      navigation.navigate("Login");

      setLoading(false);
    } catch (error) {
      console.log("Error logging out", error);
      Alert.alert("Error:", `${error}`)
    }
    setLoading(false);
  };

  useEffect(() => {
    const getUser = async () => {
      const user = await AsyncStorage.getItem("user");
      setUser(JSON.parse(user));
    };
    getUser();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader title={"Profile"} showIcon={false} theme={"dark"} />
      <View
        style={{
          backgroundColor: "#C67C4E",
          padding: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ marginBottom: 20 }}
          source={require("../assets/profile.png")}
        />
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <Text style={{ fontSize: 28, color: "white", fontFamily: 'Sora_400Regular' }}>Hello, </Text>
          <Text style={{ fontSize: 28, color: "white", fontFamily: 'Sora_600SemiBold', textTransform: 'capitalize' }}>
            {user.name}
          </Text>
        </View>
        <Text style={{ color: "white", fontFamily: 'Sora_400Regular' }}>{user.email}</Text>
        {loading ? (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              padding: 15,
              minWidth: 120,
              borderRadius: 5,
              marginVertical: 20,
              alignItems: "center",
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator size="small" color="#C67C4E" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              minWidth: 120,
              padding: 15,
              borderRadius: 5,
              marginVertical: 20,
              alignItems: "center",
              justifyContent: 'center',
              columnGap: 10,
            }}
          >
            <Text style={{ color: "#C67C4E", fontFamily: 'Sora_400Regular'}}>Log Out</Text>
            <Image
              style={{ width: 22, height: 22 }}
              source={require("../assets/exit.png")}
            />
          </TouchableOpacity>
        )}
      </View>
      {/* <Text>profile</Text> */}
    </SafeAreaView>
  );
};

export default ProfileScreen;
