import { View, Text, StyleSheet, Dimensions } from "react-native";

const CustomAlert = ({ message, title }) => {
  const {width, height} = Dimensions.get('window')
  return (
    <View style={[styles.container, {width: width, height: height}]}>
      <View style={[styles.alertContainer]}>
        <View>
          <Text style={[styles.title, {fontSize: height * 0.03}]}>{title}</Text>
        </View>
        <View>
          <Text style={styles.text}>{message}</Text>
          <View style={styles.buttonContainer}>
            <Text style={styles.button} onPress={customFunction}>
              Continue
            </Text>
            <Text
              style={styles.button}
              onPress={() => closeModal({ value: true })}
            >
              Cancel
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 3,
    borderColor: "#FFCC00",
    borderRadius: 5,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff99",
  },
  alertContainer: {
    width: '100%',
    borderRadius: 5,
    height: 200,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    overflow: "hidden",
    backgroundColor: '#fff'
  },
  title: {
    backgroundColor: "#c67c4e",
    padding: 10,
    paddingVertical: 15,
    fontFamily: 'Sora_700Bold',
    color: "#fff",
  },
  text: {
    fontSize: 14,
    fontFamily: 'Sora_400Regular',
    color: "#2F2D2C",
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  button: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#c67c4e',
    minWidth: 100,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 5,
    height: 40,
    fontFamily: 'Sora_700Bold',
    color: "#c67c4e",
    marginVertical: 10,
  },
});

export default CustomAlert;
