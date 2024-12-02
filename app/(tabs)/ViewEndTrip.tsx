import React, { useState } from 'react';
import {ScrollView ,Text, View, StyleSheet} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import Drivingstats from '@/app/(tabs)/DrivingStats';
import { useTripStorage } from '@/hooks/useTripStorage'

export default function ViewTripProgress(){
    //const [genScore, setGeneralScore] = useState(getTripAverage());
    //const [brkScore, setBrakingScore] = useState(braking);
    //const [spdScore, setSpeedScore] = useState(speed);
    //const [accScore, setAccelerationScore] = useState(acceleration);
    //const [corScore, setCorneringScore] = useState(cornering);

    const [genScore, setGeneralScore] = useState(50);
    const [brkScore, setBrakingScore] = useState(100);
    const [spdScore, setSpeedScore] = useState(50);
    const [accScore, setAccelerationScore] = useState(50);
    const [corScore, setCorneringScore] = useState(50);

    //once the values that are being used and what file they are coming from
    //this can be changed as the rest of the errors that are left
    //are related to this section above, i can fix this once they 
    //location/'s have been set

    const InfoCard = ({ typescore }: { typescore: string }) => {
        let title;
        let info;
        if(typescore == 'braking'){
            title = <Text style={styles.Title}>Braking</Text>
            info = <Text style={styles.text}>Your braking is hard, we suggest taking your time with it.</Text>
        }
        if(typescore == 'speed'){
            title = <Text style={styles.Title}>Speed</Text>
            info = <Text style={styles.text}>Your speed isn't great, follow the speed limits displayed.</Text>
        }
        if(typescore == 'cornering'){
            title = <Text style={styles.Title}>Cornering</Text>
            info = <Text style={styles.text}>You seem to be taking turns badly, we suggest you take your time with it.</Text>
        }
        if(typescore == 'acceleration'){
            title = <Text style={styles.Title}>Acceleration</Text>
            info = <Text style={styles.text}>Your acceleration isn't great, accelerate at a different rate from what you were.</Text>
        }
        if(typescore == 'all-good'){
            title = <Text style={styles.Title}>Great job</Text>
            info = <Text style={styles.text}>According to the score calculators, your doing amazing!.</Text>
        }
        return (
            <View>
                {title}
                {info}
            </View>
        );
    };

    const CircleDisplay = ({score , radivalue}: {score: number, radivalue: number}) =>{
        return(
            <CircularProgress
                value={score}
                radius={radivalue}
                progressValueColor={'black'}
                maxValue={100}
                titleStyle={{ fontWeight: 'bold' }}
                duration={250}
                strokeColorConfig={[
                    { color: '#9d1818', value: 0 },
                    { color: 'red', value: 50 },
                    { color: 'orange', value: 60 },
                    { color: '#e7db43', value: 70 },
                    { color: '#89e03b', value: 100 },
                ]}
            />
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.Title}>Trip Summary</Text>
            <Text style={styles.Title}>Driving Scores</Text>
            <View style={styles.progressContainer}>
                <CircleDisplay
                    score={genScore}
                    radivalue={80}
                />
                <Text style={styles.text}>General rating</Text>
                <View style={styles.progressrow}>
                  <View style={styles.circleContainer}>
                    <CircleDisplay
                        score={accScore}
                        radivalue={45}
                    />
                    <Text style={styles.text}>Acceleration</Text>
                  </View>
                  <View style={styles.circleContainer}>
                    <CircleDisplay
                        score={spdScore}
                        radivalue={45}
                    />
                    <Text style={styles.text}>Speed</Text>
                  </View>
                </View>
                <View style={styles.progressrow}>
                  <View style={styles.circleContainer}>
                    <CircleDisplay
                        score={brkScore}
                        radivalue={45}
                    />
                    <Text style={styles.text}>Braking</Text>
                  </View>
                  <View style={styles.circleContainer}>
                    <CircleDisplay
                        score={corScore}
                        radivalue={45}
                    />
                    <Text style={styles.text}>Cornering</Text>
                  </View>
                </View>
            </View>
            <Text style={styles.Title}>Bad Habits</Text>
            <ScrollView 
                style={styles.scrollContainer} 
                contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
            >
                {brkScore < 70 && (
                    <InfoCard
                        typescore="braking"
                    />
                )}
                {accScore < 70 && (
                    <InfoCard
                        typescore="acceleration"
                    />
                )}
                {spdScore < 70 && (
                    <InfoCard
                        typescore="speed"
                    />
                )}
                {corScore < 70 && (
                    <InfoCard
                        typescore="cornering"
                    />
                )}
                {brkScore >= 70 && accScore >= 70 && spdScore >= 70 && corScore >= 70 && (
                    <InfoCard 
                        typescore="all-good"
                    />
                )}
            </ScrollView>
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
    Title:{
      marginTop: 10,
      marginBottom: 5,
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
    },
    progressrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        display: 'flex',
        paddingTop: 5,
        width: '100%'
    },
    circleContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 175,
    },
    progressContainer: {
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: 400,
    },
    scrollContainer: {
        flex: 1,
        height: 150,
        width: 350,
    },
    scrollContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 15,
        flexWrap: 'wrap',
        maxWidth: '95%',
    },
    
});