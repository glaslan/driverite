import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Surface, Text } from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import DrivingScore from '@/components/DrivingScore';
import { useTripStorage } from '@/hooks/useTripStorage';
import TripHistory from "@/components/TripHistory";

interface DrivingScoresProps {
  scores: {
    Acceleration: number;
    Speed: number;
    Braking: number;
    Cornering: number;
  };
}

export default function DrivingStatsPage() {
  const [statsPage, setStatsPage] = useState(true);
  const [tableTimeframe, setTableTimeframe] = useState("week");
  
  if (statsPage) {
    return <DrivingStats onHistoryClicked={() => setStatsPage(false)} />
  } else {
    return <TripHistory
      onBackButtonClicked={() => setStatsPage(true)}
      timeframe={tableTimeframe}
      onTimeframeChange={(timeframe) => setTableTimeframe(timeframe)}
    />;
  }
}

function DrivingStats({ onHistoryClicked }: { onHistoryClicked: () => void }) {
  const {getOverallAverage} = useTripStorage();

  const [overallScore, setOverallScore] = useState<number>(0);
  const [scores, setScores] = useState({
    Acceleration: 0,
    Speed: 0,
    Braking: 0,
    Cornering: 0,
  });

  useEffect(() => {
    async function fetchScores() {
      const { overallAverage, overallAcceleration, overallSpeed, overallBraking, overallCornering } = await getOverallAverage();

      setOverallScore(overallAverage);
      setScores({
        Acceleration: overallAcceleration,
        Speed: overallSpeed,
        Braking: overallBraking,
        Cornering: overallCornering
      });
    }

    fetchScores();
  }, []);

  return (
    <View style={styles.background}>
      <View style={{ marginTop: "20%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <IconButton 
          icon="history" 
          iconColor="white" 
          size={30} 
          onPress={() => {}} 
        />
        <Text 
          style={{ 
            color: "black", 
            fontSize: 30, 
            textAlign: "center", 
            flex: 1 
          }}
        >
          Driving Score
        </Text>
        <IconButton 
          icon="history" 
          iconColor="black" 
          size={30} 
          onPress={onHistoryClicked}
        />
      </View>
      <View style={{display: 'flex', flexDirection: "row", width: "100%", height: "13%", padding: 10, gap: 5, justifyContent: 'space-between', marginTop: "5%"}}>
        <QuickTip messageOne="You've gone on" value={2} messageTwo="trips." color="#c7e0ff" />
        <QuickTip messageOne="You've spent" value={1284} messageTwo="minutes driving." color="#fff8c2" />
        <QuickTip messageOne="You're number" value={27} messageTwo="in the world." color="#c7ffc7" />
      </View>

      <View style={styles.progressContainer}>
        <AnimatedCircularProgress
              size={250}
              width={50}
              fill={overallScore}
              tintColor="#00e0ff"
              backgroundColor="#3d5875"
              rotation={360}>
              {
                (fill) => (
                  <View style={{alignItems: "center"}}>
                    <Text style={{ fontSize: 60, fontWeight: 800 }}>
                      { overallScore }
                    </Text>
                    <Text>
                      / 100
                    </Text>
                  </View>
                )
              }
            </AnimatedCircularProgress>
        {/* <CircularProgress
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
        /> */}
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
