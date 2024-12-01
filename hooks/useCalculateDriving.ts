import React, { useEffect, useRef, useState } from 'react';
import { Gyroscope, Accelerometer, DeviceMotion } from 'expo-sensors';

export const useCalculateDriving = (tripEnded = false, speedLimit = 50) => {
  const [speed, setSpeed] = useState(0); // Speed in km/h
  const [accelerationScore, setAccelerationScore] = useState(0);
  const [brakingScore, setBrakingScore] = useState(0);
  const [corneringScore, setCorneringScore] = useState(0);
  const [speedScore, setSpeedScore] = useState(100); // Score between 0-100
  const [scoreCount, setScoreCount] = useState(0); // Number of updates

  const [velocity, setVelocity] = useState(0); // Current velocity in m/s

  const [isBraking, setIsBraking] = useState(false);
  const [deceleration, setDeceleration] = useState(0);
  const [totalBrakingScore, setTotalBrakingScore] = useState(0);
  const [lastSpeed, setLastSpeed] = useState(0);

  const breakingThreshold = -5;

  // Function to calculate acceleration magnitude
  const calculateAccelerationMagnitude = (acceleration) => {
    return Math.sqrt(
      acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2
    );
  };

  const NOISE_THRESHOLD = 0.1; // Ignore accelerations below this in m/s²

  const calcSpeed = (acceleration, interval) => {
    const accelerationMagnitude = calculateAccelerationMagnitude(acceleration);

    // Subtract gravity (9.8 m/s²) to calculate net horizontal acceleration
    let netAcceleration = accelerationMagnitude - 9.8;

    // Ignore small changes caused by noise
    if (Math.abs(netAcceleration) < NOISE_THRESHOLD) {
      netAcceleration = 0;
    }

    // Update velocity using v = u + at
    const newVelocity = velocity + netAcceleration * interval; // in m/s

    // Ensure velocity doesn't go below 0 (e.g., if stopping completely)
    const clampedVelocity = Math.max(0, newVelocity);

    // Convert velocity to speed in km/h
    const speedInKmH = Math.round(clampedVelocity * 3.6);

    setVelocity(clampedVelocity);
    setLastSpeed(speed);
    setSpeed(speedInKmH);

    // Calculate speed score
    calcSpeedScore(speedInKmH);
  };


  const calcSpeedScore = (currentSpeed) => {
    const speedDifference = currentSpeed - speedLimit;
    let currentSpeedScore;

    if (speedDifference <= 5 && speedDifference >= -5) {
      // Within the speed limit range or below, perfect score
      currentSpeedScore = 100;
    } else if (speedDifference > 5) {
      // Above the speed limit, penalize
      currentSpeedScore = Math.max(0, 100 - (speedDifference - 5) * 2);
    } else {
      // Below the speed limit beyond the threshold (e.g., excessively slow)
      currentSpeedScore = Math.max(80, 100 + speedDifference); // Reduced penalty
    }

    setSpeedScore((prevTotal) => {
      const newTotal = prevTotal * scoreCount + currentSpeedScore;
      return Math.round(newTotal / (scoreCount + 1)); // Update accumulative average
    });
  };

  const calcAcceleration = (accelerationMagnitude) => {
    const maxAcc = 5; // Smooth acceleration threshold
    const rateOfAcceleration = accelerationMagnitude;
  
    let currentScore;
    if (rateOfAcceleration > maxAcc) {
      currentScore = 20; // Aggressive acceleration, lower score
    } else {
      currentScore = Math.max(80, 100 - rateOfAcceleration * 5); // Smooth acceleration gets a higher score
    }
  
    setAccelerationScore((prevTotal) => {
      const newTotal = prevTotal * scoreCount + currentScore;
      return Math.round(newTotal / (scoreCount + 1)); // Update accumulative average
    });
  };

  // const calcBraking = () => {
  //   const difference = speed - lastSpeed;
  //   const interval = 0.5;
  //   const currentDeceleration = difference / interval;

  //   setDeceleration(currentDeceleration);
  //   setIsBraking(currentDeceleration < breakingThreshold);

  //   setTotalBrakingScore(prevTotal => prevTotal + currentDeceleration);
  //   setBrakingScore(totalBrakingScore / scoreCount);
  // };

  // const calcCornering = () => {
  //   let gyroData = useRef({ x: 0, y: 0, z: 0 });
  //   const [gyroEnabled, setGyroEnabled] = useState(true);
  //   const [phoneOrientation, setPhoneOrientation] = useState(0);
  //   const [badCorneringInstances, setBadCorneringInstances] = useState(0);
  //   const [totalCorneringInstances, setTotalCorneringInstances] = useState(0);
  //   const [score, setScore] = useState(0);

  //   useEffect(() => {
  //     function updateCornering() {
  //       let subscription;
  //       if (gyroEnabled) {
  //         subscription = Gyroscope.addListener(gyroscopeData => {
  //           gyroData.current = gyroscopeData;
  //         });
  //       } else {
  //         subscription?.remove();
  //       }

  //       let orientation;
  //       orientation = DeviceMotion.addListener(phoneOrientation => {
  //         setPhoneOrientation(phoneOrientation.orientation);
  //       });

  //       if (Math.abs(gyroData.current.y) > 0.5 && phoneOrientation === 0) {
  //         setTotalCorneringInstances(prevTotal => prevTotal + 1);
  //         if (gyroData.current.y > 2 || gyroData.current.y < -2) {
  //           setBadCorneringInstances(badCorneringInstances + 1);
  //         }
  //       }

  //       // Add to the total counter and bad driving counter when threshold corners occur
  //       setScore(100 + 83 * Math.LN2 * (1 - 0.007 * (badCorneringInstances / totalCorneringInstances) * 100));

  //       return () => {
  //         subscription?.remove();
  //         score;
  //       };
  //     }

  //     const intervalId = setInterval(() => {
  //       if (!tripEnded) updateCornering();
  //     }, 500);
  //   }, []);

  //   setCorneringScore(score);
  // };

  useEffect(() => {
    const interval = 0.1; // Update interval in seconds (100 ms)
  
    // Set accelerometer update interval
    Accelerometer.setUpdateInterval(interval * 1000);
  
    const subscription = Accelerometer.addListener((accelerometerData) => {
      calcSpeed(accelerometerData, interval);
      const accelerationMagnitude = calculateAccelerationMagnitude(accelerometerData);
      calcAcceleration(accelerationMagnitude);
    });
  
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!tripEnded) {
        setScoreCount((prevCount) => prevCount + 1);
        // calcBraking();
        // calcCornering();
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [tripEnded]);

  return {
    speed, // Speed in km/h
    speedScore, // Accumulative average score
    accelerationScore,
    brakingScore,
    corneringScore,
  };
};
