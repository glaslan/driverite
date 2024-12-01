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
    const accelerationMagnitude = calculateAccelerationMagnitude(acceleration);
    let netAcceleration = accelerationMagnitude - 9.8;

    if (Math.abs(netAcceleration) < NOISE_THRESHOLD) {
      netAcceleration = 0;
    }

    const newVelocity = velocity + netAcceleration * interval;
    const clampedVelocity = Math.max(0, newVelocity);
    const speedInKmH = Math.round(clampedVelocity * 3.6);

    setVelocity(clampedVelocity);
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
    const difference = speed - lastSpeed;
    const interval = 0.5;
    const currentDeceleration = difference / interval;

    setDeceleration(currentDeceleration);
    setIsBraking(currentDeceleration < breakingThreshold);

    setTotalBrakingScore((prevTotal) => prevTotal + currentDeceleration);
    setBrakingScore(totalBrakingScore / scoreCount);
  };

  const setRandomSpeedLimit = () => {
    const intervalId = setInterval(() => {
      if (tripEnded) return;
  
      const limits = [30, 40, 50, 60, 70, 80];
      setSpeedLimit(limits[Math.floor(Math.random() * limits.length)]);
    }, Math.floor(Math.random() * (120000 - 30000 + 1)) + 30000); // Random interval between 30s (30000ms) and 2 minutes (120000ms)
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
