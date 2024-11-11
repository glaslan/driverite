import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import CircularProgress from 'react-native-circular-progress-indicator';
import DrivingScore from '@/components/DrivingScore';

interface DrivingScoresProps {
  scores: {
    Acceleration: number;
    Speed: number;
    Braking: number;
    Cornering: number;
  };
}

export default function DrivingStats() {
  const [overallScore, setOverallScore] = useState<number>(0);
  const [scores, setScores] = useState({
    Acceleration: Math.random() * 100,
    Speed: Math.random() * 100,
    Braking: Math.random() * 100,
    Cornering: Math.random() * 100,
  });

  function getOverallScore() {
    let total: number = 0;
    let sum: number = 0;

    for (var prop in scores) {
        if (scores.hasOwnProperty(prop)) {
            total++;
            sum += Math.round(scores[prop as keyof typeof scores]);
        }
    }

    let average: number = sum / total;
    setOverallScore(average);
  }

  useEffect(() => {
    getOverallScore();
  }, []);

  return (
    <View style={styles.background}>
      <View style={styles.progressContainer}>
        <CircularProgress
          value={overallScore}
          radius={120}
          progressValueColor={'black'}
          maxValue={100}
          title={'/ 100'}
          titleColor={'black'}
          titleStyle={{ fontWeight: 'bold' }}
          activeStrokeWidth={20}
          duration={1000}
          strokeColorConfig={[
            { color: '#9d1818', value: 0 },
            { color: 'red', value: 50 },
            { color: 'orange', value: 60 },
            { color: '#e7db43', value: 70 },
            { color: '#89e03b', value: 100 },
          ]}
        />
      </View>

      <View style={styles.scoresContainer}>
        <DrivingScores scores={scores} />
      </View>
    </View>
  );
}

function DrivingScores({ scores }: DrivingScoresProps) {
  return (
    <View style={styles.scoresList}>
      {Object.keys(scores).map((key) => (
        <DrivingScore key={key} valueName={key} value={Math.round(scores[key as keyof typeof scores])} />
      ))}
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
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '25%',
    alignItems: 'center',
    width: '100%',
  },
  scoresContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 75,
    gap: 10,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  scoresList: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
    gap: 10,
  },
});
