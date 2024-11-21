import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';

export default function DrivingScore({ valueName = "Name not set", value = 1 }) {
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

  function getMessageIcon() {
    if (value >= 95) return "star-circle";
    else if (value >= 80) return "check-circle";
    else if (value >= 70) return "minus-circle";
    else if (value >= 50) return "alert-circle";
    else return "close-circle";
  }

  return (
    <View style={styles.container}>
      <Icon
        source={getMessageIcon()}
        color={getMessageColor()}
        size={20}
      />
      <Text style={[styles.message, { color: getMessageColor() }]}>
        <Text style={styles.messageText}>{getMessage()}</Text> {valueName}!
      </Text>
      <Text style={styles.score}>{value}/100</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  score: {
    textAlign: 'right',
    fontSize: 12,
    marginRight: 25,
    color: "grey"
  },
});
