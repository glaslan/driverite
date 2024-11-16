import React, { useEffect, useRef, useState } from 'react';
import { Gyroscope, DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors'
import { Text, View } from 'react-native';
import { DeviceMotionSensor } from 'expo-sensors/build/DeviceMotion';
import { DeviceMotionOrientation } from 'expo-sensors';

export default function CorneringingStats() {

    const [gyroData, setGyroData] = useState({x: 0, y: 0, z: 0,});
    const [gyroEnabled, setGyroEnabled] = useState(true);
    const [phoneOrientation, setPhoneOrientation] = useState(0);
    const [badCorneringInstances, setBadCorneringInstances] = useState(0);
    const [totalCorneringInstances, setTotalCorneringInstances] = useState(0);
    const [score, setScore] = useState(0);
    const gyroDataRef = useRef(gyroData);

    useEffect(() => {
        gyroDataRef.current = gyroData;
        let subscription;
        if (gyroEnabled) {
            subscription = Gyroscope.addListener(gyroscopeData => {
                setGyroData(gyroscopeData);
            });
        } else {
            subscription?.remove();
        }

        let orientation; 
        orientation = DeviceMotion.addListener(phoneOrientation => {
            setPhoneOrientation(phoneOrientation.orientation);
        });


        const intervalId = setInterval(() => {
            if(Math.abs(gyroDataRef.current.y) > 0.5 && phoneOrientation === 0) {
                setTotalCorneringInstances(prevtotal => prevtotal + 1);
                if (gyroData.y > 2 || gyroData.y < -2)
                    setBadCorneringInstances(badCorneringInstances + 1);
            }
        }, 100);
        // Add to the total counter and badDriving counter when threshold corners occur
        

        setScore(50 + 50 * Math.sqrt(((totalCorneringInstances - badCorneringInstances) / totalCorneringInstances) - 0.5 ));

        // Return for the useEffect hook
        return () => {
            subscription?.remove();
            clearInterval(intervalId); 
            score;
        };
    }, [gyroData, gyroEnabled, phoneOrientation, totalCorneringInstances, badCorneringInstances]);

    return (
        <View>
            <Text>Cornering stats: x: {gyroData.x}, y: {gyroData.y}, z: {gyroData.z}</Text>
            <Text>Total Corners: {totalCorneringInstances}</Text>
            <Text>Total Bad Corners: {badCorneringInstances}</Text>
            <Text>Orientation {phoneOrientation}</Text>
        </View>
    );
}
