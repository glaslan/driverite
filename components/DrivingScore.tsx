import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { Card } from 'react-native-paper';

export default function DrivingScore({ valueName = "Name not set", value = 1 }) {
  const [score, setScore] = useState(value);

  function getMessage() {
    if (value >= 95) return "Excellent";
    else if (value >= 80) return "Good";
    else if (value >= 70) return "Decent";
    else if (value >= 50) return "Poor";
    else return "Horrible";
  }

  function getMessageColor() {
    if (value >= 95) return "#0f8000";
    else if (value >= 80) return "#89e03b";
    else if (value >= 70) return "orange";
    else if (value >= 50) return "red";
    else return "#9d1818";
  }

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <CircularProgress
            value={value}
            radius={30}
            progressValueColor={'black'}
            maxValue={100}
            titleStyle={{ fontWeight: 'bold' }}
            duration={250}
            strokeColorConfig={[
              { color: '#9d1818', value: 0 },
              { color: 'red', value: 50 },
              { color: 'orange', value: 60 },
              { color: '#e7db43', value: 70 },
              { color: '#89e03b', value: 100 },
            ]}
          />
        </View>

        <Text style={[styles.message, { color: getMessageColor() }]}>
          <Text style={styles.messageText}>{getMessage()}</Text> {valueName}!
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
  },
  message: {
    marginLeft: 25,
    textAlign: 'left',
    fontSize: 18,
    flex: 1,
  },
  messageText: {
    fontWeight: 'bold',
  },
});
