import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  Text,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import CustomHeader from "../components/CustomHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Paystack, paystackProps } from "react-native-paystack-webview";
import { Alert } from "react-native";
import { supabase } from "../utils/supabase";

const SubscriptionScreen = ({ navigation }) => {
  // Paystack
  const paystackWebViewRef = useRef(paystackProps.PayStackRef);
  // Base URL
  const baseUrl = "https://spitfire-interractions.onrender.com/";

  const [user, setUser] = useState(null);
  const checkIcon = "https://img.icons8.com/ios-filled/ffffff/50/ok--v1.png";
  const [plan, setPlan] = useState(null);

  const handleContinue = async () => {
    //signup functions
    if (plan == "free") {
      navigation.navigate("Main");
    } else if (plan == "paid") {
      await paystackWebViewRef.current.startTransaction();
    }
  };

  // get signed in user
  const getUser = async () => {
    const asyncUser = await AsyncStorage.getItem("user");
    const subscribed = JSON.parse(asyncUser).subscribed;

    const req = await fetch(`${baseUrl}/api/auth/@me`);
    const savedUser = await req.json();
    setUser({ ...savedUser.data, subscribed });
  };

  useFocusEffect(
    React.useCallback(() => {
      getUser();
    }, []) // Empty dependency array to ensure it runs only on screen focus
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader title="Subscription" showIcon={false} />
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <Text style={{ marginTop: 20, fontSize: 23 }}>Choose Plan</Text>
        <View style={{ justifyContent: "space-between", flex: 1 }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Pressable
              onPress={() => setPlan("free")}
              style={{
                shadowColor: "#2F2D2C",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.5,
                shadowRadius: 3,
                elevation: 5,
                marginTop: 20,
                width: "100%",
              }}
            >
              <View
                style={{
                  backgroundColor: "#C67C4E",
                  width: "100%",
                  paddingHorizontal: 20,
                  paddingTop: 20,
                  paddingBottom: 40,
                  borderTopRightRadius: 5,
                  borderTopLeftRadius: 5,
                }}
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 25,
                      fontWeight: 600,
                      marginBottom: 15,
                      fontFamily: "Sora_600SemiBold",
                    }}
                  >
                    Free plan
                  </Text>
                  {plan == "free" ? (
                    <Image
                      style={{
                        width: 24,
                        height: 24,
                      }}
                      source={{
                        uri: checkIcon,
                      }}
                    />
                  ) : (
                    <Text></Text>
                  )}
                </View>
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    fontFamily: "Sora_400Regular",
                  }}
                >
                  Unlock a world of possibilities with our exclusive FREE TRIAL
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "white",
                  width: "100%",
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                }}
              >
                <Text
                  style={{
                    padding: 20,
                    color: "#C67C4E",
                    fontFamily: "Sora_400Regular",
                  }}
                >
                  {user ? user.credits : 3} Free Trials Left
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setPlan("paid")}
              style={{
                shadowColor: "#2F2D2C",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.5,
                shadowRadius: 3,
                elevation: 5,
                marginTop: 20,
                width: "100%",
              }}
            >
              <View
                style={{
                  backgroundColor: "#C67C4E",
                  width: "100%",
                  paddingHorizontal: 20,
                  paddingTop: 20,
                  paddingBottom: 40,
                  borderTopRightRadius: 5,
                  borderTopLeftRadius: 5,
                }}
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 25,
                      fontWeight: 600,
                      marginBottom: 15,
                      fontFamily: "Sora_600SemiBold",
                    }}
                  >
                    Premium plan
                  </Text>
                  {plan == "paid" ? (
                    <Image
                      style={{
                        width: 24,
                        height: 24,
                      }}
                      source={{
                        uri: checkIcon,
                      }}
                    />
                  ) : (
                    <Text></Text>
                  )}
                </View>
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    fontFamily: "Sora_400Regular",
                  }}
                >
                  Experience premium features with no commitment
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "white",
                  width: "100%",
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                }}
              >
                <Text
                  style={{
                    padding: 20,
                    color: "#C67C4E",
                    fontFamily: "Sora_400Regular",
                  }}
                >
                  $5/Month
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Subsscription button */}
          {/* {plan ? (
              <TouchableOpacity onPress={handleContinue} >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.button, {backgroundColor: `${plan ? '#C67C4E':'#E2BDA6'}`, justifyContent:'center', alignItems:'center'}]}>
              <Text style={styles.buttonText}>Continue</Text>
              </View>
            )} */}
          {plan ? (
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
              <Text
                style={[styles.buttonText, { fontFamily: "Sora_400Regular" }]}
              >
                Continue
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                backgroundColor: "#E2BDA6",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: 62,
                borderRadius: 16,
                marginTop: 30,
                marginBottom: 20,
              }}
            >
              <Text
                style={[styles.buttonText, { fontFamily: "Sora_400Regular" }]}
              >
                Continue
              </Text>
            </View>
          )}
        </View>
      </View>

      <Paystack
        paystackKey="pk_test_f3072ef0f73e406f6f669a31617dc6f8e7a9fd86"
        paystackSecretKey="sk_test_7143006ec0232ef14acfcd39b014ed5975b0fbd9"
        billingEmail="johnnie.vehe@gmail.com"
        amount={"5000.00"}
        billingName="Team Artemis"
        currency="NGN"
        onCancel={(e) => {
          // handle response here
          console.log(e);
        }}
        onSuccess={async (res) => {
          // handle response here
          console.log(res);
          if (res.status === "success") {
            console.log("success");
            setUser({ ...user, subscribed: true });
            await AsyncStorage.setItem(
              "user",
              JSON.stringify({ ...user, subscribed: true })
            );
            const { error } = await supabase
              .from("users")
              .update({ subscribed: true })
              .eq("id", user.id);
            await AsyncStorage.getItem("user");
            navigation.navigate("Main");
          }
        }}
        ref={paystackWebViewRef}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 62,
    borderRadius: 16,
    backgroundColor: "#C67C4E",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default SubscriptionScreen;
