import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { LoadObjectFromStorage, SaveObjectToStorage } from "@/components/Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SegmentedButtons } from 'react-native-paper';
import { List } from 'react-native-paper';
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from 'react-native';

// Test code
const DummyTripResults = {
  score: 0,
  acceleration: 0,
  speed: 0,
  breaking: 0,
  cornering: 0,
  tripStart: new Date(),
  tripEnd: new Date(),
};

// Define Trip interface
interface Trip {
  score: number;
  acceleration: number;
  speed: number;
  breaking: number;
  cornering: number;
  tripStart: Date;
  tripEnd: Date;
}

export default function TripHistory() {
  const [tableTimeframe, setTableTimeframe] = useState("week");
  const [graphLabels, setGraphLabels] = useState<string[]>([]);
  const [average, setAverage] = useState<number>(0);
  const [tripElements, setTripElements] = useState<Trip[]>([]);

  function getGraphLabels() {
    if (tableTimeframe === "week") return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    else if (tableTimeframe === "month") return ["5th", "10th", "15th", "20th", "25th"];
    else return ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  }

  useEffect(() => {
    setGraphLabels(getGraphLabels());
  }, [tableTimeframe]);

  async function fetchData() {
    // Test code starts
    await AsyncStorage.clear();

    for (let i = 0; i < 10; i++) {
      const tripData = Object.assign({}, DummyTripResults);
      tripData.score = Math.round(Math.random() * 100);
      await SaveObjectToStorage(`Trip ${i}`, tripData);
    }
    // Test code ends

    const [tempAverage, tempTripElements] = await GetTripHistory();

    setAverage(Number(tempAverage));
    setTripElements(tempTripElements as Trip[]);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function getIconColor(value: number) {
    if (value >= 95) return "#0f8000";
    else if (value >= 80) return "#89e03b";
    else if (value >= 70) return "orange";
    else if (value >= 50) return "red";
    else return "#9d1818";
  }

  function formatTime(value: number): string {
	return value < 10 ? `0${value}` : `${value}`;
  }

  return (
    <View style={styles.background}>
      <Text style={{ color: "black", display: "flex", alignSelf: 'center', fontSize: 30, marginTop: "20%" }}>History</Text>
      <SegmentedButtons
        value={tableTimeframe}
        onValueChange={(e) => { setTableTimeframe(e) }}
        buttons={[
          {
            value: 'week',
            label: 'Week',
          },
          { value: 'month', label: 'Month' },
          { value: 'year', label: 'Year' },
        ]}
        style={{ width: "80%", display: "flex", alignSelf: "center", marginTop: "5%" }}
      />
      <View style={{ display: "flex", alignSelf: "center", marginTop: "5%" }}>
        <LineChart
          data={{
            labels: graphLabels,
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100
                ]
              }
            ]
          }}
          width={Dimensions.get("window").width * 0.9}
          height={220}
          yAxisSuffix="%"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(102, 51, 153, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 1
            },
            propsForDots: {
              color: "black"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 1
          }}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        {tripElements.map((trip, index) => (
          <List.Accordion key={index} title={`${new Date(trip.tripStart).getDay()}/${new Date(trip.tripStart).getMonth()}/${new Date(trip.tripStart).getFullYear()}`}
		  description={`${trip.score}/100`} left={props => <List.Icon {...props} icon="circle-slice-8" color={getIconColor(trip.score)} />}>
            <List.Item
				title={`Your trip was ${((new Date(trip.tripEnd).getTime() - new Date(trip.tripStart).getTime()) / (1000 * 60)).toFixed(0)} minutes long`}
				description={`Your trip started at ${formatTime(new Date(trip.tripStart).getHours())}:${formatTime(new Date(trip.tripStart).getMinutes())}\nThe trip ended at ${formatTime(new Date(trip.tripEnd).getHours())}:${formatTime(new Date(trip.tripEnd).getMinutes())}`}
			/>
            <List.Item title={`Your acceleration has a score of ${trip.acceleration}`} />
            <List.Item title={`Your speed has a score of: ${trip.speed}`} />
            <List.Item title={`Your braking has a score of: ${trip.breaking}`} />
            <List.Item title={`Your cornering has a score of: ${trip.cornering}`} />
          </List.Accordion>
        ))}
      </ScrollView>
    </View>
  );
}

async function GetTripHistory() {
  const keys = await AsyncStorage.getAllKeys();

  let sum = 0;
  let tripElements: Trip[] = [];

  for (let i = 0; i < keys.length; i++) {
    const trip = await LoadObjectFromStorage(keys[i]);

    sum += trip.score;

    tripElements[i] = trip;
  }

  const average = Math.round(sum / keys.length);
  return [average, tripElements];
}

const styles = StyleSheet.create({
  background: {
    display: "flex",
    width: "100%",
    height: "100%",
    backgroundColor: "white"
  },

  header: {
    color: "black",
    textAlign: "center",
    marginVertical: 28
  },

  scrollView: {
    paddingHorizontal: 20
  },

  averageScoreView: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    marginHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#D3D3D3",
    height: "20%"
  },

  listElement: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    padding: 20,
    borderRadius: 8,
    backgroundColor: "#D3D3D3",
    marginVertical: 10
  },

  listElementText: {
    fontSize: 12,
    textAlign: "center"
  }
});
