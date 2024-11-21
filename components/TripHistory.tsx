import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { LoadObjectFromStorage, SaveObjectToStorage } from "@/components/Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SegmentedButtons } from 'react-native-paper';
import { List } from 'react-native-paper';
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from 'react-native';
import { useTripStorage } from '@/hooks/useTripStorage';

// Define Trip interface
interface Trip {
  score: number;
  acceleration: number;
  speed: number;
  braking: number;
  cornering: number;
  tripStart: Date;
  tripEnd: Date;
}

export default function TripHistory() {
  const [tableTimeframe, setTableTimeframe] = useState("week");
  const [graphLabels, setGraphLabels] = useState<string[]>([]);
  const [graphValues, setGraphValues] = useState<Array<number>>([0,0,0,0,0,0,0]);
  const [average, setAverage] = useState<number>(0);
  const [trips, setTrips] = useState<Trip[]>([]);

  const { getTripHistory } = useTripStorage();
  

  function getGraphLabels() {
    if (tableTimeframe === "week") return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    else if (tableTimeframe === "month") return ["5th", "10th", "15th", "20th", "25th"];
    else return ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  }

  useEffect(() => {
    setGraphLabels(getGraphLabels());

	if (tableTimeframe === "week") calculateAverageScoresByDay();
	else if (tableTimeframe === "month") calculateAverageScoresByMonth();
	else calculateAverageScoresByYear();
  }, [tableTimeframe, trips]);

  useEffect(() => {
    async function fetchData() {
      const fetchedTrips = await getTripHistory();
      setTrips(fetchedTrips);
    }
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

  const calculateAverageScoresByDay = () => {
	const dailyScores = [0, 0, 0, 0, 0, 0, 0];
	const dailyCounts = [0, 0, 0, 0, 0, 0, 0];
  
	trips.forEach((trip) => {
	  const tripDate = new Date(trip.tripStart);
	  const dayOfWeek = tripDate.getDay();
	  const score = trip.score;
	  
	  dailyScores[dayOfWeek] += score;
	  dailyCounts[dayOfWeek] += 1;
	});
  
	const tempGraphValues = dailyScores.map((score, index) => {
	  return dailyCounts[index] > 0 ? score / dailyCounts[index] : 0;
	});
  
	setGraphValues(tempGraphValues);
  };

  const calculateAverageScoresByMonth = () => {
	const dayRanges = [0, 5, 10, 15, 20, 25];
	const monthlyScores = new Array(5).fill(0);
	const monthlyCounts = new Array(5).fill(0);
  
	trips.forEach((trip) => {
	  const tripDate = new Date(trip.tripStart);
	  const dayOfMonth = tripDate.getDate();
	  const score = trip.score;
  
	  let periodIndex = 0;
	  for (let i = 0; i < dayRanges.length - 1; i++) {
		if (dayOfMonth >= dayRanges[i] + 1 && dayOfMonth <= dayRanges[i + 1]) {
		  periodIndex = i;
		  break;
		}
	  }
  
	  monthlyScores[periodIndex] += score;
	  monthlyCounts[periodIndex] += 1;
	});
  
	const tempGraphValues = monthlyScores.map((score, index) => {
	  return monthlyCounts[index] > 0 ? score / monthlyCounts[index] : 0;
	});
  
	setGraphValues(tempGraphValues);
  };

  const calculateAverageScoresByYear = () => {
	const yearlyScores = new Array(12).fill(0);
	const yearlyCounts = new Array(12).fill(0);
  
	trips.forEach((trip) => {
	  const tripDate = new Date(trip.tripStart);
	  const month = tripDate.getMonth();
	  const score = trip.score;
  
	  yearlyScores[month] += score;
	  yearlyCounts[month] += 1;
	});
  
	const tempGraphValues = yearlyScores.map((score, index) => {
	  return yearlyCounts[index] > 0 ? score / yearlyCounts[index] : 0;
	});
  
	setGraphValues(tempGraphValues);
  };
  

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
                data: graphValues
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
        {trips.map((trip, index) => (
          <List.Accordion key={index} title={`${new Date(trip.tripStart).getDay()+1}/${new Date(trip.tripStart).getMonth()+1}/${new Date(trip.tripStart).getFullYear()}`}
		  description={`${trip.score}/100`} left={props => <List.Icon {...props} icon="circle-slice-8" color={getIconColor(trip.score)} />}>
            <List.Item
				title={`Your trip was ${((new Date(trip.tripEnd).getTime() - new Date(trip.tripStart).getTime()) / (1000 * 60)).toFixed(0)} minutes long`}
				description={`Your trip started at ${formatTime(new Date(trip.tripStart).getHours())}:${formatTime(new Date(trip.tripStart).getMinutes())}\nThe trip ended at ${formatTime(new Date(trip.tripEnd).getHours())}:${formatTime(new Date(trip.tripEnd).getMinutes())}`}
			/>
            <List.Item title={`Your acceleration has a score of ${trip.acceleration}`} />
            <List.Item title={`Your speed has a score of ${trip.speed}`} />
            <List.Item title={`Your braking has a score of ${trip.braking}`} />
            <List.Item title={`Your cornering has a score of ${trip.cornering}`} />
          </List.Accordion>
        ))}
      </ScrollView>
    </View>
  );
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
