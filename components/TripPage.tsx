import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function TripPage() {
    return(<><Text variant="displayLarge" style={styles.background}>A trip has started</Text></>);
};

const styles = StyleSheet.create({
    background: {
      display: "flex",
      width: "100%",
      height: "100%",
      backgroundColor: "white"
    },
});