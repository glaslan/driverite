import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import GPSDrawer from "./GPSDrawer";
import MapAccelerometer from "./MapAccelerometer";
import { useState } from "react";

export default function TripPage({ setTripStarted, setShowTripSummary, setRecentTrip, startTime }) {
    return(<>
    <View style={styles.gpsDrawer}>
      <GPSDrawer setTripStarted={setTripStarted} setShowTripSummary={setShowTripSummary} setRecentTrip={setRecentTrip} startTime={startTime} />
    </View>
</>);
};

const styles = StyleSheet.create({
    background: {
      display: "flex",
      width: "100%",
      height: "100%",
      backgroundColor: "white"
    }, 
    gpsDrawer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1, // Ensures GPSDrawer is above MapAccelerometer
      pointerEvents: 'auto', // GPSDrawer remains interactive
    },
    mapAccelerometer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0, // MapAccelerometer is below GPSDrawer
      pointerEvents: 'auto', // Allows MapAccelerometer to be interactive behind the GPSDrawer
    },
});