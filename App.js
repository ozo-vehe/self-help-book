import React, { useState, useEffect, useCallback } from "react";
// import { StatusBar } from "expo-status-bar";
import { View, SafeAreaView, StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { StackNavigation } from "./navigation/StackNavigation";
import { useFonts, Sora_300Light, Sora_700Bold, Sora_600SemiBold, Sora_400Regular } from '@expo-google-fonts/sora';


// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  let [fontsLoaded, fontError] = useFonts({ Sora_300Light, Sora_700Bold, Sora_600SemiBold, Sora_400Regular });
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (!fontsLoaded && !fontError) {
          return null;
        }
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      console.log("ready");
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    console.log("Not ready");
    return null;
  }

  return (
    <View style={{flex:1, fontFamily: 'Sora_400Regular'}} onLayout={onLayoutRootView}>
      <StatusBar />
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </View>
  );
}
