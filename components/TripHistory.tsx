import React, { useEffect, useState } from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {LoadObjectFromStorage, SaveObjectToStorage} from "@/components/Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Test code
const DummyTripResults = {
	score: 0,
	acceleration: 0,
	speed: 0,
	breaking: 0,
	cornering: 0
}

export default function TripHistory() {
	const [average, setAverage] = useState<number>(0);
	const [tripElements, setTripElements] = useState<object>({});


	async function fetchData() {
		console.log("1");

		const keysBeforeClear = await AsyncStorage.getAllKeys();
		console.log("Keys before clear:", keysBeforeClear);

		// Test code starts
		await AsyncStorage.clear();

		console.log("2");

		for (let i = 0; i < 10; i++) {
			const tripData = Object.assign({}, DummyTripResults);
			tripData.score = Math.round(Math.random() * 100);
			await SaveObjectToStorage(`Trip ${i}`, tripData);
		}
		// Test code ends

		// I used a tuple to avoid having multiple for loops
		const [tempAverage, tempTripElements] = await GetTripHistory();

		setAverage(Number(tempAverage));
		setTripElements(Object(tempTripElements));

		console.log(tempAverage);
		console.log("tripElements", tripElements);
	}

	useEffect(() => {
		console.log("useEffect");
		fetchData();
	}, []);

	return (
		<View style={styles.background}>
			<Text style={styles.header}>Trip History</Text>
			<View style={styles.averageScoreView}>
				<Text>{average}</Text>
			</View>
			<ScrollView style={styles.scrollView}>
				<Text>{average}</Text>
				{/* {tripElements} */}
			</ScrollView>
		</View>
	);
}

async function GetTripHistory() {
	const keys = await AsyncStorage.getAllKeys();

	let sum = 0;
	let tripElements = [];

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