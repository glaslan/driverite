import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Divider, Icon, Text } from 'react-native-paper';
import * as Location from 'expo-location';
import { useTripStorage } from '@/hooks/useTripStorage';

type StartPageProps = {
    setTripStarted: React.Dispatch<React.SetStateAction<boolean>>;
};

interface weatherData {
    message: string;
    icon: string;
    color: string;
}

interface weatherStats {
    temperature: number;
}

interface widgetStats {
    overallScore: number;
    lastTrip: number;
}

const StartPage: React.FC<StartPageProps> = ({ setTripStarted }) => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [weatherStats, setWeatherStats] = useState<weatherStats>();
    const [weatherData, setWeatherData] = useState<weatherData>();
    const [widgetStats, setWidgetStats] = useState<widgetStats>();

    const {getOverallAverage, getTripHistory, getTripAverage} = useTripStorage();

    useEffect(() => {
        async function getWidgetStats() {
            const {overallAverage} = await getOverallAverage();
            const allTrips = await getTripHistory();
            const lastTripAverage = getTripAverage(allTrips[0]);
            setWidgetStats({overallScore: overallAverage, lastTrip: lastTripAverage});
        }

        async function getWeather() {
            console.log("location", location)
        if (location === null) return;
            //console.log(location);

            const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&current_weather=true`
            );
            const jsonResponse = await response.json();
            setWeatherStats(jsonResponse.current_weather);
            console.log(jsonResponse.current_weather);
            setWeatherData(getWeatherData(jsonResponse.current_weather.weathercode));

            getWidgetStats();
        }

        getWeather();
    }, [location]);

    useEffect(() => {
        async function getCurrentLocation() {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        }
    
        getCurrentLocation();
      }, []);

    return (
        <View style={styles.background}>
            <View style={{marginTop: 60, padding: 30}}>
                    <Text style={{fontSize: 32, fontWeight: 200}}>Welcome to</Text>
                    <Text style={{fontSize: 40, fontWeight: 600}}>Driverite</Text>
            </View>
            <Card style={{backgroundColor: "white", width: "90%", display: "flex", alignSelf: "center"}}>
                <Card.Content>
                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Icon
                            source={weatherData?.icon || "weather-sunny"}
                            color={weatherData?.color || "white"}
                            size={70}
                        />
                        <View style={{display: "flex", flexDirection: "row"}}>
                            <Text style={{fontSize: 48, fontWeight: 600}}>{weatherStats?.temperature}</Text>
                            <Text style={{fontSize: 16, marginTop: 10}}> °C</Text>
                        </View>
                    </View>
                    <Divider bold style={{marginTop: 15, marginBottom: 15}} />
                    <Text>{weatherData?.message}</Text>
                </Card.Content>
            </Card>

            <View style={{width: "90%", display: "flex", alignSelf: "center", marginTop: 20}}><Text style={{fontSize: 18, fontWeight: 600}}>Let's catch you up...</Text></View>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "center", alignSelf: "center", gap: 10, width: "90%"}}>
                <Card style={{backgroundColor: "white"}}>
                    <Card.Content>
                     <View style={{width: 140, height: 140, display: "flex", justifyContent: "center"}}>
                            <Text style={{fontSize: 18, fontWeight: 600}}>Overall Score</Text>
                            <Text style={{fontSize: 48, fontWeight: 800, color: getScoreColor(widgetStats?.overallScore || 0)}}>{widgetStats?.overallScore}%</Text>
                        </View>
                    </Card.Content>
                </Card>
                <Card style={{backgroundColor: "white"}}>
                    <Card.Content> 8
                        <View style={{width: 140, height: 140, display: "flex", justifyContent: "center"}}>
                            <Text style={{fontSize: 18, fontWeight: 600}}>Last Trip</Text>
                            <Text style={{fontSize: 48, fontWeight: 800, color: getScoreColor(widgetStats?.lastTrip || 0)}}>{widgetStats?.lastTrip}%</Text>
                        </View>
                    </Card.Content>
                </Card>
            </View>

            <Button icon="car" mode="contained" onPress={() => setTripStarted(true)} style={{width: "75%", height: 50, justifyContent: "center", alignItems: "center", alignSelf: "center", marginTop: 20}}>
                Start Trip!
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        gap: 15
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

function getScoreColor(value) {
    if (value >= 95) return "#0f8000";
    else if (value >= 80) return "#89e03b";
    else if (value >= 70) return "orange";
    else if (value >= 50) return "red";
    else return "#9d1818";
  }

const getWeatherData = (code) => {
    switch (code) {
        case 0:
            return { message: "Clear skies ahead! Great for driving.", icon: "weather-sunny", color: "yellow" };
        case 1:
            return { message: "Mainly clear skies. A smooth drive today!", icon: "weather-partly-cloudy", color: "yellow" };
        case 2:
            return { message: "Partly cloudy. Keep an eye on the road, but smooth driving.", icon: "weather-cloudy", color: "yellow" };
        case 3:
            return { message: "Overcast conditions. Drive safely, visibility may be reduced.", icon: "weather-cloudy", color: "grey" };
        case 45:
            return { message: "Foggy conditions ahead. Drive slow and use fog lights.", icon: "weather-fog", color: "grey" };
        case 48:
            return { message: "Depositing rime fog. Caution on the road, slippery spots possible.", icon: "weather-fog", color: "grey" };
        case 51:
            return { message: "Light rain. Keep your distance and slow down for a safer drive.", icon: "weather-rainy", color: "blue" };
        case 53:
            return { message: "Moderate rain. Watch for slick roads, and adjust your speed.", icon: "weather-rainy", color: "blue" };
        case 55:
            return { message: "Heavy rain. Stay alert, roads could be flooded and slippery.", icon: "weather-pouring", color: "blue" };
        case 56:
            return { message: "Light freezing rain. Be extra cautious, the roads could be icy.", icon: "weather-snowy-rainy", color: "lightblue" };
        case 57:
            return { message: "Freezing rain. Watch out for icy patches, drive with care.", icon: "weather-snowy-rainy", color: "lightblue" };
        case 61:
            return { message: "Light shower rain. Be cautious of wet roads and reduce speed.", icon: "weather-rainy", color: "blue" };
        case 63:
            return { message: "Moderate shower rain. Visibility could be reduced, stay alert.", icon: "weather-rainy", color: "blue" };
        case 65:
            return { message: "Heavy shower rain. Slow down and drive with caution on wet roads.", icon: "weather-pouring", color: "blue" };
        case 66:
            return { message: "Light sleet. Roads may be slippery, keep a safe distance.", icon: "weather-snowy-rainy", color: "lightgrey" };
        case 67:
            return { message: "Heavy sleet. Road conditions could be dangerous, drive carefully.", icon: "weather-snowy-rainy", color: "lightgrey" };
        case 71:
            return { message: "Light snow. Watch for icy roads and reduced visibility.", icon: "weather-snowy", color: "lightgrey" };
        case 73:
            return { message: "Moderate snow. Snow accumulation could make roads slick, drive cautiously.", icon: "weather-snowy", color: "lightgrey" };
        case 75:
            return { message: "Heavy snow ahead! Roads may be covered, drive slowly.", icon: "weather-snowy", color: "lightgrey" };
        case 77:
            return { message: "Snow grains. Low visibility, make sure to drive with care.", icon: "weather-snowy", color: "lightgrey" };
        case 80:
            return { message: "Light shower snow. Snow could make roads slippery, drive slowly.", icon: "weather-snowy-rainy", color: "lightgrey" };
        case 81:
            return { message: "Moderate shower snow. Watch for icy roads, reduce your speed.", icon: "weather-snowy-rainy", color: "lightgrey" };
        case 82:
            return { message: "Heavy shower snow. Dangerous driving conditions. Avoid unnecessary travel.", icon: "weather-snowy-rainy", color: "lightgrey" };
        case 85:
            return { message: "Light hail. Be cautious of sudden impacts, stay safe on the road.", icon: "weather-hail", color: "lightgrey" };
        case 86:
            return { message: "Heavy hail. Hail could damage your vehicle. Pull over if necessary.", icon: "weather-hail", color: "lightgrey" };
        case 95:
            return { message: "Thunderstorm ahead. Strong winds and lightning, avoid driving if possible.", icon: "weather-lightning", color: "purple" };
        case 96:
            return { message: "Thunderstorm with light hail. Dangerous driving conditions, seek shelter if needed.", icon: "weather-lightning", color: "purple" };
        case 99:
            return { message: "Thunderstorm with heavy hail. Stay off the roads, conditions are hazardous.", icon: "weather-lightning", color: "purple" };
        default:
            return { message: "Unknown weather. Stay cautious and check for updates.", icon: "weather-cloudy", color: "grey" };
    }
};
