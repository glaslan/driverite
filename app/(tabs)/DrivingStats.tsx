import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Surface, Text } from 'react-native-paper';
import CircularProgress from 'react-native-circular-progress-indicator';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
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
    // Acceleration: 100,
    // Speed: 100,
    // Braking: 100,
    // Cornering: 100,
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
      <Text style={{color: "black", display: "flex", alignSelf: 'center', fontSize: 30, marginTop: "20%"}}>Driving Score</Text>
      <View style={{display: 'flex', flexDirection: "row", width: "100%", height: "13%", padding: 10, gap: 5, justifyContent: 'space-between', marginTop: "5%"}}>
        <QuickTip messageOne="You've gone on" value={2} messageTwo="trips." color="#c7e0ff" />
        <QuickTip messageOne="You've spent" value={1284} messageTwo="minutes driving." color="#fff8c2" />
        <QuickTip messageOne="You're number" value={27} messageTwo="in the world." color="#c7ffc7" />
      </View>

      <View style={styles.progressContainer}>
    {/* <AnimatedCircularProgress
          size={250}
          width={50}
          fill={overallScore}
          tintColor="#00e0ff"
          backgroundColor="#3d5875">
          {
            (fill) => (
              <Text style={{ fontSize: 50 }}>
                { overallScore }
              </Text>
            )
          }
        </AnimatedCircularProgress> */}
        <CircularProgress
          value={overallScore}
          radius={135}
          progressValueColor={'black'}
          maxValue={100}
          title={'/ 100'}
          titleColor={'black'}
          titleStyle={{ fontWeight: "300", fontSize: 20 }}
          activeStrokeWidth={50}
          inActiveStrokeWidth={40}
          duration={1000}
          activeStrokeColor={'red'}
          activeStrokeSecondaryColor={'green'}
          // strokeColorConfig={[
          //   { color: '#9d1818', value: 0 },
          //   { color: 'red', value: 50 },
          //   { color: 'orange', value: 60 },
          //   { color: '#e7db43', value: 70 },
          //   { color: '#89e03b', value: 100 },
          // ]}
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
    <Surface style={styles.surface}>
      {Object.keys(scores).map((key) => (
        <DrivingScore key={key} valueName={key} value={Math.round(scores[key as keyof typeof scores])} />
      ))}
    </Surface>
  );
}

interface QuickTipProps {
  messageOne: string;
  value: number;
  messageTwo: string;
  color: string;
}

function QuickTip({ messageOne, value, messageTwo, color }: QuickTipProps) {
  return (
    <View style={{ backgroundColor: color, flex: 1, justifyContent: 'center', borderRadius: 10 }}>
      <View style={{padding: 10}}>
      <Text style={{fontWeight: "500", fontSize: 12, textAlign: 'left'}}>{messageOne}</Text>
      <Text style={{fontWeight: "800", fontSize: 18, textAlign: 'left'}}>{value}</Text>
      <Text style={{fontWeight: "500", fontSize: 12, textAlign: 'left'}}>{messageTwo}</Text>
      </View>
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
    marginTop: 40,
    alignItems: 'center',
    width: '100%',
  },
  scoresContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 40,
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
  surface: {
    backgroundColor: "white",
    padding: 20,
    width: "95%",
    display: "flex",
    borderRadius: 35,
  },
});
