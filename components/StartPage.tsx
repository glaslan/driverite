import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

type StartPageProps = {
    setTripStarted: React.Dispatch<React.SetStateAction<boolean>>;
};

const StartPage: React.FC<StartPageProps> = ({ setTripStarted }) => {
    return (
        <View style={styles.background}>
            <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>Welcome to</Text>
                <Text style={styles.appNameText}>Driverite</Text>
                <Text style={styles.instructionsText}>Press Start Trip to begin...</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button 
                    mode="contained" 
                    style={styles.startButton} 
                    onPress={() => setTripStarted(true)}
                >
                    Start Trip
                </Button>
                <Text style={styles.warningText}>
                    Always make sure your device is hands-free while driving. Start your trip before you begin driving.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "white"
    },
    welcomeContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '50%',
        marginHorizontal: 'auto',
        textAlign: 'left',
    },
    welcomeText: {
        fontSize: 16,
        lineHeight: 18,
    },
    appNameText: {
        fontSize: 40,
        fontWeight: '600',
        lineHeight: 44,
    },
    instructionsText: {
        fontSize: 16,
        lineHeight: 18,
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 75,
        gap: 25,
    },
    startButton: {
        borderRadius: 20,
        width: '50%',
        height: 50,
        justifyContent: 'center',
    },
    warningText: {
        textAlign: 'center',
        fontSize: 14,
        width: '75%',
    },
});

export default StartPage;
