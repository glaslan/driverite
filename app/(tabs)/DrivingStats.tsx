import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Divider, IconButton, Surface, Text } from 'react-native-paper';
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

interface Trip {
  score: number;
  acceleration: number;
  speed: number;
  braking: number;
  cornering: number;
  tripStart: Date;
  tripEnd: Date;
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
  const {getOverallAverage, getTripHistory} = useTripStorage();

  const [overallScore, setOverallScore] = useState<number>(0);
  const [scores, setScores] = useState({
    Acceleration: 0,
    Speed: 0,
    Braking: 0,
    Cornering: 0,
  });
  const [trips, setTrips] = useState<Array<Trip>>()
  const [driveTime, setDriveTime] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      const { overallAverage, overallAcceleration, overallSpeed, overallBraking, overallCornering } = await getOverallAverage();

      setOverallScore(overallAverage);
      setScores({
        Acceleration: overallAcceleration,
        Speed: overallSpeed,
        Braking: overallBraking,
        Cornering: overallCornering
      });

      function getTotalHoursDriving(allTrips: Trip[]): number {
        if (!Array.isArray(allTrips)) {
          throw new Error("Invalid input: allTrips must be an array.");
        }
      
        if (allTrips.length === 0) {
          console.warn("No trips found.");
          return 0;
        }
      
        let totalMilliseconds = 0;
      
        for (let i = 0; i < allTrips.length; i++) {
          const tripStart = new Date(allTrips[i].tripStart);
          const tripEnd = new Date(allTrips[i].tripEnd);
      
          if (isNaN(tripStart.getTime()) || isNaN(tripEnd.getTime())) {
            console.error("Invalid trip dates:", allTrips[i]);
            continue;
          }
      
          totalMilliseconds += tripEnd.getTime() - tripStart.getTime();
        }
      
        const totalHours = totalMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours
        const roundedTotalHours = Number(totalHours.toFixed(2));
        return roundedTotalHours;
      }
      

      const allTrips = await getTripHistory();
      const timeDriving = getTotalHoursDriving(allTrips);
      setTrips(allTrips);
      setDriveTime(timeDriving);
    }

    fetchStats();
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
        <QuickTip messageOne="You've gone on" value={trips?.length || 0} messageTwo="trips." color="#c7e0ff" />
        <QuickTip messageOne="You've spent" value={driveTime} messageTwo="hours driving." color="#fff8c2" />
        <QuickTip messageOne="You're number" value={Math.floor(Math.random() * 500)} messageTwo="in the world." color="#c7ffc7" />
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
      </View>

      <View style={styles.scoresContainer}>
        <DrivingScores scores={scores} />
      </View>
    </View>
  );
}

function DrivingScores({ scores }: DrivingScoresProps) {
  return (
    <Surface style={styles.surface} elevation={0}>
      {Object.keys(scores).map((key) => (
        <View key={key}>
        <DrivingScore valueName={key} value={Math.round(scores[key as keyof typeof scores])} />
        {key !== "Cornering" && <Divider />}
        </View>
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
    padding: 10,
    width: "95%",
    display: "flex",
    borderRadius: 35,

  },
});
