import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Dashboard from '../../components/Dashboard';
import { useState } from 'react';
import StartPage from '@/components/StartPage';
import TripPage from '@/components/TripPage';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

export default function HomeScreen() {
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

  return (
    <PaperProvider theme={theme}>
    {!tripStarted ? <StartPage setTripStarted={setTripStarted} /> : <TripPage />}
    </PaperProvider>
  );
}