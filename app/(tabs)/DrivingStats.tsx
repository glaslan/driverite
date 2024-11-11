import DrivingScore from '@/components/DrivingScore';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import CircularProgress from 'react-native-circular-progress-indicator';


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
    <>
      <Box sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "25%",
          alignItems: "center",
          width: "100%"
      }}>
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
            { color: `#e7db43`, value: 70 },
            { color: '#89e03b', value: 100 },
          ]}
        />
      </Box>
      <Box sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "75px",
          gap: "10px",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
      }}>
        <DrivingScores scores={scores} />
      </Box>
    </>
  );
};

function DrivingScores({ scores }: DrivingScoresProps) {
  return (
    <Box sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        width: "90%",
        gap: "10px"
    }}>
      {Object.keys(scores).map((key) => (
        <DrivingScore key={key} valueName={key} value={Math.round(scores[key as keyof typeof scores])} />
      ))}
    </Box>
  );
}
