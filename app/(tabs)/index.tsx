import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Dashboard from '../../components/Dashboard';
import { useState } from 'react';
import StartPage from '@/components/StartPage';
import TripPage from '@/components/TripPage';

export default function HomeScreen() {
const [tripStarted, setTripStarted] = useState(false);

  return (
    <>
    {!tripStarted ? <StartPage setTripStarted={setTripStarted} /> : <TripPage />}
    </>
  );
}