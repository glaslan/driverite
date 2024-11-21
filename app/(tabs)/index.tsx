import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import MapAccelerometer from '@/components/MapAccelerometer';
import { useTripStorage } from '@/hooks/useTripStorage';
import GPSDrawer from '@/components/GPSDrawer';
import StartPage from '@/components/StartPage';

export default function HomeScreen() {
  const { generateDummyData } = useTripStorage();
  const [tripStarted, setTripStarted] = useState(false);

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
    generateDummyData();
  }, []);

  return (
    <PaperProvider theme={theme}>
      {!tripStarted ? (
        <StartPage setTripStarted={setTripStarted} />
      ) : (
        <>
          <View style={styles.gpsDrawer}>
            <GPSDrawer />
          </View>
          <View style={styles.mapAccelerometer}>
            <MapAccelerometer />
          </View>
        </>
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
