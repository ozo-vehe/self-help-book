import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, Text, View } from "react-native";
import HomeScreen from "../screens/HomeScreen";
// import CustomBottomNavigation from "../components/CustomBottomNavigation";
import HistoryScreen from "../screens/HistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import homeActive from '../assets/homeActive.png';
import homeInactive from '../assets/homeInactive.png';
import historyActive from '../assets/historyActive.png';
import historyInactive from '../assets/historyInactive.png';
import profileActive from '../assets/profileActive.png';
import profileInactive from '../assets/profileInactive.png';

// const
const Tab = createBottomTabNavigator();
export function TabNavigation() {

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 80,
          paddingHorizontal: 20,
          borderTopEndRadius: 50,
          borderTopStartRadius: 50,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: "center" }}>
              <Image
                style={{ width: size, height: size }}
                source={focused ? require('../assets/homeActive.png') : require('../assets/homeInactive.png')}
              />
              <Text
                style={{ color: focused ? "#c67c4e" : "#2f2d2c", fontSize: 14 }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: "center" }}>
              <Image
                style={{ width: size, height: size }}
                source={focused ? require('../assets/historyActive.png') : require('../assets/historyInactive.png')}
              />
              <Text
                style={{ color: focused ? "#c67c4e" : "#2f2d2c", fontSize: 14 }}
              >
                History
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: "center" }}>
              <Image
                style={{ width: size, height: size }}
                source={focused ? require('../assets/profileActive.png') : require('../assets/profileInactive.png')}
              />
              <Text
                style={{ color: focused ? "#c67c4e" : "#2f2d2c", fontSize: 14 }}
              >
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
