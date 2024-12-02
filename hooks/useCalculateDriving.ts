import React, { useEffect, useRef, useState } from 'react';
import { Gyroscope, Accelerometer, DeviceMotion } from 'expo-sensors';

export const useCalculateDriving = (tripEnded = false) => {
  const [speed, setSpeed] = useState(0); // Speed in km/h
  const [accelerationScore, setAccelerationScore] = useState(0);
  const [brakingScore, setBrakingScore] = useState(0);
  const [corneringScore, setCorneringScore] = useState(0);
  const [speedScore, setSpeedScore] = useState(100); // Score between 0-100
  const [scoreCount, setScoreCount] = useState(0); // Number of updates

  const [speedLimit, setSpeedLimit] = useState(50);

  const [velocity, setVelocity] = useState(0); // Current velocity in m/s
  const [isBraking, setIsBraking] = useState(false);
  const [deceleration, setDeceleration] = useState(0);
  const [totalBrakingScore, setTotalBrakingScore] = useState(0);
  const [lastSpeed, setLastSpeed] = useState(0);

  const breakingThreshold = -5;
  const NOISE_THRESHOLD = 0.1; // Ignore accelerations below this in m/s²

  // Cornering state
  const gyroData = useRef({ x: 0, y: 0, z: 0 });
  const [gyroEnabled, setGyroEnabled] = useState(true);
  const [phoneOrientation, setPhoneOrientation] = useState(0);
  const [badCorneringInstances, setBadCorneringInstances] = useState(0);
  const [totalCorneringInstances, setTotalCorneringInstances] = useState(0);

  // Function to calculate acceleration magnitude
  const calculateAccelerationMagnitude = (acceleration) => {
    return Math.sqrt(
      acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2
    );
  };

  const calcSpeed = (acceleration, interval) => {
    const currentAcceleration = calculateAccelerationMagnitude(acceleration);
  
    // Apply noise filtering
    if (Math.abs(currentAcceleration) < NOISE_THRESHOLD) {
      return;
    }

    // Update velocity using trapezoidal integration
    const newVelocity = velocity + (currentAcceleration * interval);
    
    // Apply decay factor to prevent drift
    const decayFactor = 1;
    const decayedVelocity = newVelocity * decayFactor;
    
    // Convert to km/h and ensure non-negative
    const speedInKmH = Math.max(0, Math.round(decayedVelocity * 3.6));
    //if (speedInKmH > 0) console.log(speedInKmH + 0);    

    setVelocity(decayedVelocity);
    setLastSpeed(speed);
    setSpeed(speedInKmH);
    calcSpeedScore(speedInKmH);
  };

  const calcSpeedScore = (currentSpeed) => {
    const speedDifference = currentSpeed - speedLimit;
    let currentSpeedScore;

    if (speedDifference <= 5 && speedDifference >= -5) {
      currentSpeedScore = 100;
    } else if (speedDifference > 5) {
      currentSpeedScore = Math.max(0, 100 - (speedDifference - 5) * 2);
    } else {
      currentSpeedScore = Math.max(80, 100 + speedDifference);
    }

    setSpeedScore((prevTotal) => {
      const newTotal = prevTotal * scoreCount + currentSpeedScore;
      return Math.round(newTotal / (scoreCount + 1));
    });
  };

  const calcAcceleration = (accelerationMagnitude) => {
    const maxAcc = 5;
    const rateOfAcceleration = accelerationMagnitude;
    let currentScore;

    if (rateOfAcceleration > maxAcc) {
      currentScore = 20;
    } else {
      currentScore = Math.max(80, 100 - rateOfAcceleration * 5);
    }

    setAccelerationScore((prevTotal) => {
      const newTotal = prevTotal * scoreCount + currentScore;
      return Math.round(newTotal / (scoreCount + 1));
    });
  };

  const calcBraking = () => {
    const difference = Math.abs(speed - lastSpeed);
    const interval = 0.5;
    const currentDeceleration = difference / interval;

    setDeceleration(currentDeceleration);
    setIsBraking(currentDeceleration < breakingThreshold);

    setBrakingScore((prevTotal) => {
      const newTotal = prevTotal * scoreCount + currentDeceleration;
      return Math.round(newTotal / (scoreCount + 1));
    });
  };

  const setRandomSpeedLimit = () => {
    const intervalId = setInterval(() => {
      if (tripEnded) return;
  
      const limits = [30, 40, 50, 60, 70, 80];
      setSpeedLimit(limits[Math.floor(Math.random() * limits.length)]);
    }, Math.floor(Math.random() * (60000 - 15000 + 1)) + 15000); // Random interval between 15s (15000ms) and 1 minute (60000ms)
  };  

  useEffect(() => {
    if (!gyroEnabled) return;

    const gyroSubscription = Gyroscope.addListener((gyroscopeData) => {
      gyroData.current = gyroscopeData;
    });

    const orientationSubscription = DeviceMotion.addListener((motionData) => {
      setPhoneOrientation(motionData.orientation);
    });

    return () => {
      gyroSubscription.remove();
      orientationSubscription.remove();
    };
  }, [gyroEnabled]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (tripEnded) return;

      setTotalCorneringInstances((prev) => prev + 1);
      if (Math.abs(gyroData.current.y) > 2 && phoneOrientation === 0) {
        setBadCorneringInstances((prev) => prev + 1);
      }

      const corneringScore = Math.max(
        0,
        100 - (badCorneringInstances / (totalCorneringInstances || 1)) * 100
      );
      setCorneringScore(Math.round(corneringScore));
    }, 500);

    return () => clearInterval(intervalId);
  }, [tripEnded, badCorneringInstances, totalCorneringInstances]);

  useEffect(() => {
    const interval = 0.1;
    Accelerometer.setUpdateInterval(interval * 1000);

    setRandomSpeedLimit();

    const accelerometerSubscription = Accelerometer.addListener(
      (accelerometerData) => {
        calcSpeed(accelerometerData, interval);
        const accelerationMagnitude = calculateAccelerationMagnitude(
          accelerometerData
        );
        calcAcceleration(accelerationMagnitude);
        
        if (isBraking) {
          calcBraking();
        }
      }
    );

    return () => accelerometerSubscription?.remove();
  }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     if (!tripEnded) {
  //       setScoreCount((prev) => prev + 1);
  //       calcBraking();
  //     }
  //   }, 500);

  //   return () => clearInterval(intervalId);
  // }, [tripEnded]);

  return {
    speed,
    speedLimit,
    speedScore,
    accelerationScore,
    brakingScore,
    corneringScore,
  };
};
