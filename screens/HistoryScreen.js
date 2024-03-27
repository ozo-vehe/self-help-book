import React, { useState, } from "react";
import {
  FlatList,
  SafeAreaView,
  View,
  ActivityIndicator,
  Text,
  Dimensions,
} from "react-native";
import { supabase } from "../utils/supabase";
import CustomHeader from "../components/CustomHeader";
import { TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

const HistoryScreen = ({ navigation }) => {
  const { height } = Dimensions.get("window");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get details of the history item and pass it to the result screen
  const historyDetails = (item) => {
    console.log(item);
    const { chat, id: chatId } = item;
    console.log(item.id);
    navigation.navigate("Results", { result: chat, chatId });
  };

  // Use useFocusEffect to fetch data when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      const getUser = async () => {
        setLoading(true);
        try {
          const res = await fetch(
            "https://spitfire-interractions.onrender.com/api/auth/@me"
          );
          const response = await res.json();

          // Add this line to inspect the response
          // console.log('Response:', response);
          if (response) {
            let { data } = await supabase
              .from("chats")
              .select("*")
              .eq("user_id", response?.data?.id);
            console.log(data?.length);
            setData(data);
          }

          // setLoading(false);
        } catch (error) {
          console.error("Error logging out", error);
        }
        setLoading(false);
      };
      getUser();
    }, []) // Empty dependency array to ensure it runs only on screen focus
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader title={"History"} showIcon={false} theme={"light"} />
      <View style={{ marginTop: 10, flex: 1 }}>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="black" />
          </View>
        ) : (
          <FlatList
            style={{ paddingHorizontal: 20, flex: 1 }}
            data={data}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "#2F2D2C",
                  textAlign: "center",
                  minHeight: height * 0.06,
                  borderRadius: 4,
                  padding: 10,
                  marginVertical: 7,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => historyDetails(item)}
              >
                <Text
                  style={{
                    color: "#2f2d2c",
                    fontSize: height * 0.017,
                    fontFamily: 'Sora_400Regular',
                  }}
                >
                  {item?.chat[0]?.question}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()} // Use index as key
            // Other props like numColumns, horizontal, etc. can be added here
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
