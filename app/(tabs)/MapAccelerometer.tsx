// Map Accelerometer Screen
// Joshua Salmons
// Version 1.0
import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    ViewStyle,
    TextStyle,
} from 'react-native';
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapAccelerometer(): JSX.Element {
    // Location state
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);
    const [speed, setSpeed] = useState<number>(0);
    const [region, setRegion] = useState<Region>({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Trip tracking state
    const [isTracking, setIsTracking] = useState<boolean>(false);
    const isTrackingRef = useRef<boolean>(isTracking);
    const [totalSpeed, setTotalSpeed] = useState<number>(0);
    const [sampleCount, setSampleCount] = useState<number>(0);
    const [averageSpeed, setAverageSpeed] = useState<number>(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [tick, setTick] = useState<number>(0); // State variable to force re-render

    // Update isTrackingRef whenever isTracking changes
    useEffect(() => {
        isTrackingRef.current = isTracking;
    }, [isTracking]);

    // Location functions
    const _watchLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                Alert.alert('Permission denied', 'Cannot access location services.');
                return;
            }

            const locSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 500,
                    distanceInterval: 0.1,
                },
                (newLocation) => {
                    setLocation(newLocation);

                    // Handle speed calculation safely
                    const rawSpeed = newLocation.coords.speed;
                    let currentSpeed = 0;

                    if (rawSpeed != null && rawSpeed >= 0) {
                        currentSpeed = rawSpeed * 3.6; // Convert from m/s to km/h
                    } else {
                        currentSpeed = 0; // Set to 0 if speed is negative or null
                    }

                    setSpeed(currentSpeed);

                    // Collect speed samples if tracking
                    if (isTrackingRef.current) {
                        setTotalSpeed((prevTotalSpeed) => prevTotalSpeed + currentSpeed);
                        setSampleCount((prevSampleCount) => prevSampleCount + 1);
                    }

                    // Update region
                    setRegion((prevRegion) => ({
                        ...prevRegion,
                        latitude: newLocation.coords.latitude,
                        longitude: newLocation.coords.longitude,
                    }));
                }
            );
            setLocationSubscription(locSubscription);
        } catch (error) {
            setErrorMsg('Error while fetching location');
            console.error(error);
        }
    };

    const _unsubscribeLocation = () => {
        locationSubscription?.remove();
        setLocationSubscription(null);
    };

    useEffect(() => {
        _watchLocation();
        return () => {
            _unsubscribeLocation();
        };
    }, []);

    // Update averageSpeed whenever totalSpeed or sampleCount changes
    useEffect(() => {
        if (sampleCount > 0) {
            setAverageSpeed(totalSpeed / sampleCount);
        } else {
            setAverageSpeed(0);
        }
    }, [totalSpeed, sampleCount]);

    // useEffect to force re-render every second when tracking is active
    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | null = null;

        if (isTracking) {
            timer = setInterval(() => {
                setTick((prevTick) => prevTick + 1);
            }, 1000);
        }

        return () => {
            if (timer !== null) clearInterval(timer);
        };
    }, [isTracking]);

    const handleStartPause = () => {
        if (isTracking) {
            // Pause
            if (startTime) {
                setElapsedTime((prevElapsedTime) => prevElapsedTime + (Date.now() - startTime));
                setStartTime(null);
            }
            setIsTracking(false);
        } else {
            // Start
            setStartTime(Date.now());
            setIsTracking(true);
        }
    };

    const handleEndTrip = () => {
        // End Trip
        if (startTime) {
            setElapsedTime((prevElapsedTime) => prevElapsedTime + (Date.now() - startTime));
            setStartTime(null);
        }
        setIsTracking(false);
        setElapsedTime(0);
        setTotalSpeed(0);
        setSampleCount(0);
        setAverageSpeed(0);
    };

    // Determine speed box color
    const getSpeedBoxColor = (): string => {
        if (speed > 100) {
            return 'red';
        } else if (speed >= 80) {
            return 'yellow';
        } else {
            return 'rgba(255, 255, 255, 0.9)';
        }
    };

    // Format time in hh:mm:ss
    function formatTime(milliseconds: number): string {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    const totalTime = isTracking && startTime ? elapsedTime + (Date.now() - startTime) : elapsedTime;

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
                showsUserLocation={true}
                followsUserLocation={true}
            />

            {/* Speed Box */}
            <View style={[styles.speedContainer, { backgroundColor: getSpeedBoxColor() }]}>
                <Text style={styles.speedText}>{speed.toFixed(0)} km/h</Text>
            </View>

            {/* Trip Info (Average Speed and Total Time) */}
            <View style={styles.tripInfoContainer}>
                <Text style={styles.tripInfoText}>Average Speed: {averageSpeed.toFixed(0)} km/h</Text>
                <Text style={styles.tripInfoText}>Total Trip Time: {formatTime(totalTime)}</Text>
            </View>

            {/* Start/Pause and End Trip Buttons */}
            <View style={styles.startPauseContainer}>
                <TouchableOpacity
                    onPress={handleStartPause}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>{isTracking ? 'Pause' : 'Start'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleEndTrip}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>End Trip</Text>
                </TouchableOpacity>
            </View>

            {/* Existing Info Box (Coordinates) */}
            <View style={styles.infoContainer}>
                {location ? (
                    <>
                        <Text style={styles.infoText}>
                            Latitude: {location.coords.latitude.toFixed(6)}
                        </Text>
                        <Text style={styles.infoText}>
                            Longitude: {location.coords.longitude.toFixed(6)}
                        </Text>
                    </>
                ) : (
                    <Text style={styles.infoText}>Fetching location...</Text>
                )}
            </View>
        </View>
    );
}


interface Styles {
    container: ViewStyle;
    map: ViewStyle;
    speedContainer: ViewStyle;
    speedText: TextStyle;
    infoContainer: ViewStyle;
    infoText: TextStyle;
    startPauseContainer: ViewStyle;
    tripInfoContainer: ViewStyle;
    tripInfoText: TextStyle;
    button: ViewStyle;
    buttonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    speedContainer: {
        position: 'absolute',
        bottom: 85,
        right: 270,
        left: 10,
        padding: 8,
        borderRadius: 20,
        alignItems: 'center',
    },
    speedText: {
        fontSize: 24,
        color: '#000',
        fontWeight: 'bold',
    },
    infoContainer: {
        position: 'absolute',
        bottom: 85,
        left: 200,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 8,
        borderRadius: 20,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 16,
        color: '#000',
    },
    startPauseContainer: {
        position: 'absolute',
        bottom: 20,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 8,
        borderRadius: 20,
        alignItems: 'center',
    },
    tripInfoContainer: {
        position: 'absolute',
        bottom: 150,
        left: 200,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 8,
        borderRadius: 20,
        alignItems: 'center',
    },
    tripInfoText: {
        fontSize: 16,
        color: '#000',
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#000',
    },
});