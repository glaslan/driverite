import { StyleSheet, View, Platform, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import MapAccelerometer from '@/components/MapAccelerometer';
import { useTripStorage } from '@/hooks/useTripStorage';
import GPSDrawer from '@/components/GPSDrawer';
import StartPage from '@/components/StartPage';
import TripPage from '@/components/TripPage';
import ViewEndTrip from '@/components/ViewEndTrip';

export default function HomeScreen() {
  const { generateDummyData } = useTripStorage();
  const [tripStarted, setTripStarted] = useState(false);
  const [showTripSummary, setShowTripSummary] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [recentTrip, setRecentTrip] = useState({
      score: 0,
      acceleration: 0,
      speed: 0,
      braking: 0,
      cornering: 0,
      tripStart: new Date(),
      tripEnd: new Date(),
  });

  const theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      primary: '#6200ee',
      background: '#ffffff',
      text: '#000000',
    },
  };

  useEffect(() => {
    generateDummyData(8);
  }, []);

  return (
    <PaperProvider theme={theme}>
      {tripStarted ? (
          <TripPage setTripStarted={setTripStarted} setShowTripSummary={setShowTripSummary} setRecentTrip={setRecentTrip} startTime={startTime} />
      ) : (
          showTripSummary ? (
            <ViewEndTrip recentTrip={recentTrip} setShowTripSummary={setShowTripSummary} />
          ) : (
            <StartPage setTripStarted={setTripStarted} setStartTime={setStartTime} />
          )
      )}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  gpsDrawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'auto',
  },
  mapAccelerometer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'auto',
  },
});
