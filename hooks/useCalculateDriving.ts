import React, { useEffect, useState, useRef } from 'react';
import { Gyroscope, Accelerometer, DeviceMotion } from 'expo-sensors';

export const useCalculateDriving = () => {
  const [tripEnded, setTripEnded] = useState(false);
  const [acceleration, setAcceleration] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [brakingScore, setBrakingScore] = useState(0);
  const [totalBrakingScore, setTotalBrakingScore] = useState(0);
  const [corneringScore, setCorneringScore] = useState(0);
  const [accelerationMagnitude, setAccelerationMagnitude] = useState(0); // To store the magnitude of acceleration
  const [lastSpeed, setLastSpeed] = useState(0); // To store the previous speed for acceleration calculation
  const [accelerationScore, setAccelerationScore] = useState(100); // The score based on acceleration behavior
  const [totalAccelerationScore, setTotalAccelerationScore] = useState(0); // Cumulative score
  const [scoreCount, setScoreCount] = useState(0); // Number of updates

  const [isBraking, setIsBraking] = useState(false);
  const [deceleration, setDeceleration] = useState(0);

  const maxAcc = 5; // Threshold for smooth acceleration (e.g., 5 m/s² could be considered aggressive)
  const breakingThreshold = -5;

  const calcAcceleration = () => {
    let accelerationData = useRef({ x: 0, y: 0, z: 0 });

    const accelerationSubscription = Accelerometer.addListener(accelData => {
      accelerationData.current = accelData;

      const magnitude = Math.sqrt(
        Math.pow(accelerationData.current.x, 2) +
        Math.pow(accelerationData.current.y, 2) +
        Math.pow(accelerationData.current.z, 2)
      );
      setAccelerationMagnitude(magnitude);

      const deltaSpeed = Math.abs(speed - lastSpeed);
      const rateOfAcceleration = deltaSpeed / 0.5;

      let currentScore;
      if (rateOfAcceleration > maxAcc) {
        currentScore = 20; // Aggressive acceleration, lower score
      } else {
        currentScore = Math.max(80, 100 - rateOfAcceleration * 5); // Smooth acceleration gets a higher score
      }

      // Update the cumulative acceleration score
      setTotalAccelerationScore(prevTotal => prevTotal + currentScore);
      setScoreCount(prevCount => prevCount + 1); // Increase the update count

      setLastSpeed(speed);

      if (tripEnded) {
        const averageScore = totalAccelerationScore / scoreCount;
        setAcceleration(averageScore);
      } else {
        setAcceleration(currentScore);
      }
    });

    return () => accelerationSubscription.remove();
  };

  const calcSpeed = () => {
    setSpeed(Math.random() * 100); // Random speed for testing
  };

  const calcBraking = () => {
    const difference = speed - lastSpeed;
    const interval = 0.5;
    const currentDeceleration = difference / interval;

    setDeceleration(currentDeceleration);
    setIsBraking(currentDeceleration < breakingThreshold);

    setTotalBrakingScore(prevTotal => prevTotal + currentDeceleration);
    setBrakingScore(totalBrakingScore / scoreCount);
  };

  const calcCornering = () => {
    let gyroData = useRef({ x: 0, y: 0, z: 0 });
    const [gyroEnabled, setGyroEnabled] = useState(true);
    const [phoneOrientation, setPhoneOrientation] = useState(0);
    const [badCorneringInstances, setBadCorneringInstances] = useState(0);
    const [totalCorneringInstances, setTotalCorneringInstances] = useState(0);
    const [score, setScore] = useState(0);

    useEffect(() => {
      function updateCornering() {
        let subscription;
        if (gyroEnabled) {
          subscription = Gyroscope.addListener(gyroscopeData => {
            gyroData.current = gyroscopeData;
          });
        } else {
          subscription?.remove();
        }

        let orientation;
        orientation = DeviceMotion.addListener(phoneOrientation => {
          setPhoneOrientation(phoneOrientation.orientation);
        });

        if (Math.abs(gyroData.current.y) > 0.5 && phoneOrientation === 0) {
          setTotalCorneringInstances(prevTotal => prevTotal + 1);
          if (gyroData.current.y > 2 || gyroData.current.y < -2) {
            setBadCorneringInstances(badCorneringInstances + 1);
          }
        }

        // Add to the total counter and bad driving counter when threshold corners occur
        setScore(100 + 83 * Math.LN2 * (1 - 0.007 * (badCorneringInstances / totalCorneringInstances) * 100));

        return () => {
          subscription?.remove();
          score;
        };
      }

      const intervalId = setInterval(() => {
        if (!tripEnded) updateCornering();
      }, 500);
    }, []);

    setCorneringScore(score);
  };

  // Start calculating
  useEffect(() => {
    if (!tripEnded) {
      const intervalId = setInterval(() => {
        // Refresh the acceleration calculation every 0.5 seconds
        calcAcceleration();
        calcSpeed();
        calcBraking();
        calcCornering();
      }, 500); // 500 milliseconds = 0.5 seconds

      // Cleanup interval when the trip ends
      return () => clearInterval(intervalId);
    }
  }, [speed, tripEnded]);

  return { calcAcceleration, calcSpeed, calcBraking, calcCornering, acceleration, speed, brakingScore, corneringScore };
};
