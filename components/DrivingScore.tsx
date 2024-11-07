import { Typography } from '@mui/material';
import React, { useState } from 'react';
import CircularProgress from 'react-native-circular-progress-indicator';

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
    <>
      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between", // This will push the elements to the edges
        alignItems: "center", // Aligns items vertically in the center
        width: "100%", // Ensures the container takes up full width
        background: "white",
        border: "10px solid white",
        borderRadius: "10px",
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
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
              { color: `#e7db43`, value: 70 },
              { color: '#89e03b', value: 100 },
            ]}
          />
        </div>
        
        <Typography style={{ marginLeft: 25, textAlign: "left", flex: 1, fontSize: 18 }}>
          <b style={{ color: getMessageColor() }}>{getMessage()}</b> {valueName}!
        </Typography>
      </div>
    </>
  );
}
