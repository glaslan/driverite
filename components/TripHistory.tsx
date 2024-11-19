import React from 'react';
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

export async function TripHistory() {
	// Test code starts
	await AsyncStorage.clear();

	for (let i = 0; i < 10; i++) {
		const tripData = Object.assign({}, DummyTripResults);
		tripData.score = Math.round(Math.random() * 100);
		await SaveObjectToStorage(`Trip ${i}`, tripData);
	}
	// Test code ends

	// I used a tuple to avoid having multiple for loops
	const [average, tripElements] = await GetTripHistory();

	return (
		<View style={styles.background}>
			<Text style={styles.header}>Trip History</Text>
			<View style={styles.averageScoreView}>
				{average}
			</View>
			<ScrollView style={styles.scrollView}>
				{tripElements}
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

		tripElements[i] =
			<View style={styles.listElement}>
				<Text style={styles.listElementText}>Score: {trip.score}</Text>
				<Text>|</Text>
				<Text style={styles.listElementText}>Speed: {trip.speed}</Text>
				<Text>|</Text>
				<Text style={styles.listElementText}>Accel: {trip.acceleration}</Text>
			</View>;
	}

	const average = <Text>Average Score: {Math.round(sum / keys.length)}</Text>;
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