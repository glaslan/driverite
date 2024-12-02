import React, { useCallback, useRef, useMemo, useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Button, Surface } from "react-native-paper";
import MapAccelerometer from "./MapAccelerometer";
import { useCalculateDriving } from "@/hooks/useCalculateDriving";
import { useTripStorage } from "@/hooks/useTripStorage";

const GPSDrawer = ({ setTripStarted, setShowTripSummary, setRecentTrip, startTime }) => {
  const [speedMath, setSpeed] = useState(0);
  const [tripEnded, setTripEnded] = useState(false);

  const { speed, speedLimit, accelerationScore, speedScore, brakingScore, corneringScore } = useCalculateDriving(tripEnded);
  const { saveTrip } = useTripStorage();

  function getSpeedColor() {
    if (speed >= speedLimit - 5 && speed <= speedLimit + 5) return "green";
    else if (speed >= speedLimit - 10 && speed <= speedLimit + 10) return "orange";
    else return "red";
  }

  const [speedColor, setSpeedColor] = useState(getSpeedColor());

  useEffect(() => {
    setSpeedColor(getSpeedColor());
  }, [speed, speedLimit]);

  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["25%", "70%"], []);

  // callbacks
  const handleSheetChange = useCallback((index: number) => {
    // console.log("handleSheetChange", index);
  }, []);
  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.snapToIndex(0);
    //sheetRef.current?.close();
  }, []);

  function SpeedLimitSign() {
    return (
        <Surface style={{width: 100, height: 120, display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 15}}>
            <Text style={{fontWeight: 600, fontSize: 18, textAlign: "center", width: "80%"}}>Speed Limit</Text>
            <Text style={{fontWeight: 800, fontSize: 42, marginTop: 2}}>{speedLimit}</Text>
        </Surface>
    );
}

  function handleEndTrip() {
    const trip = {
      score: (accelerationScore + speedScore + brakingScore + corneringScore) / 4,
      acceleration: accelerationScore,
      speed: speedScore,
      braking: brakingScore,
      cornering: corneringScore,
      tripStart: startTime,
      tripEnd: new Date(),
    };
  
    saveTrip(trip);
    setTripStarted(false);
    setTripEnded(true);
    setShowTripSummary(true);
    setRecentTrip(trip);
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: "110%"
      }}>
        <MapAccelerometer speed={speed} setSpeed={setSpeed} setTripEnded={setTripEnded} />
      </View>
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        enableOverDrag={false}
      >
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
            <View style={{display: "flex", flexDirection: "column"}}>
             <View style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 80, marginTop: 15}}>
              <View style={{display: "flex"}}>
                <AnimatedCircularProgress
                    size={125}
                    width={15}
                    fill={speed}
                    tintColor={speedColor}
                    backgroundColor="#3d5875"
                    rotation={360}
                    >
                    {
                        (fill) => (
                        <View style={{alignItems: "center"}}>
                            <Text style={{ fontSize: 40, fontWeight: 800 }}>
                            { speed }
                            </Text>
                            <Text>
                            KM / H
                            </Text>
                        </View>
                        )
                    }
                 </AnimatedCircularProgress>
                </View>
                <View style={{display: "flex"}}>
                    <SpeedLimitSign />
                </View>
                </View>

                    <View style={{marginTop: 50, marginLeft: 25, marginRight: 25, display: "flex", padding: 10, gap: 15, justifyContent: "center", alignItems: "center"}}>
                      <View style={{ paddingLeft: 5, paddingRight: 5, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                      <Text><Text style={{fontWeight: "800"}}>{accelerationScore}%</Text> acceleration</Text>
                      <Text style={{marginLeft: "auto"}}><Text style={{fontWeight: "800"}}>{speedScore}%</Text> speed</Text>
                    </View>
                    <View style={{ paddingLeft: 5, paddingRight: 5, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                      <Text><Text style={{fontWeight: "800"}}>{brakingScore}%</Text> braking</Text>
                      <Text style={{marginLeft: "auto"}}><Text style={{fontWeight: "800"}}>{corneringScore}%</Text> cornering</Text>
                    </View>



                      <View style={{display: "flex", flexDirection: "row", justifyContent: "center", gap: 15, marginTop: 15}}>
                       <Surface style={{width: "45%", height: 100, padding: 20, borderRadius: 15, backgroundColor: "white"}}>
                          <Text>DRIVE SCORE</Text>
                          <Text style={{fontWeight: 600, fontSize: 32, marginTop: 5}}>82%</Text>
                        </Surface>
                        <Surface style={{width: "45%", height: 100, padding: 20, borderRadius: 15, backgroundColor: "white"}}>
                          <Text>DRIVE TIME</Text>
                          <Text style={{fontWeight: 600, fontSize: 32, marginTop: 5}}>2.4h</Text>
                        </Surface>
                      </View>

                    </View>
                    <View style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: 30}}>
                     <Button mode="contained" buttonColor="red" textColor="white" style={{width: "80%", height: 50, display: "flex", justifyContent: "center", alignContent: "center"}}
                      onPress={() => { handleEndTrip(); }}>End Trip</Button>
                    </View>
                </View>
            <View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});

export default GPSDrawer;