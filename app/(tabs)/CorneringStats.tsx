import React, { useEffect, useRef, useState } from 'react';
import { Gyroscope, DeviceMotion } from 'expo-sensors'

export default function CorneringingStats() {

    let gyroData = useRef({x: 0, y: 0, z: 0,});
    const [gyroEnabled, setGyroEnabled] = useState(true);
    const [phoneOrientation, setPhoneOrientation] = useState(0);
    const [badCorneringInstances, setBadCorneringInstances] = useState(0);
    const [totalCorneringInstances, setTotalCorneringInstances] = useState(0);
    const [score, setScore] = useState(0);

    // Turn this into a custom hook???
    
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


                if(Math.abs(gyroData.current.y) > 0.5 && phoneOrientation === 0) {
                    setTotalCorneringInstances(prevtotal => prevtotal + 1);
                    if (gyroData.current.y > 2 || gyroData.current.y < -2)
                        setBadCorneringInstances(badCorneringInstances + 1);
                }
            // Add to the total counter and badDriving counter when threshold corners occur
            
            setScore(100+83*Math.LN2*(1-0.007*(badCorneringInstances/totalCorneringInstances)*100));

            // Return for the useEffect hook
            return () => {
                subscription?.remove();
                score;
            };
        }
        const intervalId = setInterval(() => {updateCornering()}, 500);
    }, [] );
    // Re-triggers the useEffect when these variables change.

    return score;
}

