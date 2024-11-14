import React, { useEffect, useState } from 'react';
import { Gyroscope, DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors'

export default function CorneringingStats() {

    const [{ x, y, z }, setGyro] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [subscription, setSubscription] = useState(null);

    const subscribe = () => {
        setSubscription(
            Gyroscope.addListener(gyroscopeData => {
                setGyro(gyroscopeData);
            })
        );
    };

    const [orientation, setorientation] = useState<DeviceMotionMeasurement | null>(null);
    let previousGyro = [];
    const maxStoredGyro = 10;

    DeviceMotion.addListener(orientation);
    if (orientation?.orientation == 0) {
        // Get correct gyro number for portrait
        if (x > 2) {
            previousGyro.push(x);
        }
    } 
    else if (orientation?.orientation == 90) {
            // Get correct gyro number for right landscape
            if (z > 2) {
                previousGyro.push(z);
            }
    }
    else if (orientation?.orientation == 180) {
        // Get correct gyro number for left landscape
        if (x < 2) {
            previousGyro.push(x);
        }
}

    useEffect(() => {
        subscribe();
    }, []);

}
