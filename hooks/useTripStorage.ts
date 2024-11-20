import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadObjectFromStorage, SaveObjectToStorage } from "@/components/Storage";

export const useTripStorage = () => {

    interface Trip {
        score: number;
        acceleration: number;
        speed: number;
        braking: number;
        cornering: number;
        tripStart: Date;
        tripEnd: Date;
    }

    const tripTemplate = {
        score: 0,
        acceleration: 0,
        speed: 0,
        braking: 0,
        cornering: 0,
        tripStart: new Date(),
        tripEnd: new Date(),
    };

    function getTripAverage(trip: Trip) {
        return Math.round((trip.acceleration + trip.speed + trip.braking + trip.cornering) / 4);
    }

    async function emptyDatabase() {
        await AsyncStorage.clear();
    }

    async function generateDummyData(amount = 10) {
        await emptyDatabase();

        for (let i = 0; i < amount; i++) {
            const tripData = Object.assign({}, tripTemplate);

            // Populate stats with random scores
            tripData.acceleration = Math.round(Math.random() * 100);
            tripData.speed = Math.round(Math.random() * 100);
            tripData.braking = Math.round(Math.random() * 100);
            tripData.cornering = Math.round(Math.random() * 100);
            tripData.score = getTripAverage(tripData);

            // Set random time and duration of trip
            tripData.tripStart = new Date(2024, Math.random() * 11, Math.random() * 31);
            tripData.tripStart.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);

            const tripLength = Math.floor(Math.random() * (120 - 10 + 1) + 10) * 60 * 1000;
            tripData.tripEnd = new Date(tripData.tripStart.getTime() + tripLength);

            await SaveObjectToStorage(`Trip ${i}`, tripData);
          }
    }

    async function getTripHistory() {
        const keys = await AsyncStorage.getAllKeys();
        let trips: Trip[] = [];
      
        for (let i = 0; i < keys.length; i++) {
          const trip = await LoadObjectFromStorage(keys[i]);
          trips[i] = trip;
        }
   
        return trips;
      }

      async function getOverallAverage() {
        const keys = await AsyncStorage.getAllKeys();
      
        let sum = 0;
        let acceleration = 0;
        let speed = 0;
        let braking = 0;
        let cornering = 0;
      
        for (let i = 0; i < keys.length; i++) {
          const trip = await LoadObjectFromStorage(keys[i]);
      
          sum += trip.score;
          acceleration += trip.acceleration;
          speed += trip.speed;
          braking += trip.braking;
          cornering += trip.cornering;
        }
      
        const overallAverage = Math.round(sum / keys.length);
        const overallAcceleration = Math.round(acceleration / keys.length);
        const overallSpeed = Math.round(speed / keys.length);
        const overallBraking = Math.round(braking / keys.length);
        const overallCornering = Math.round(cornering / keys.length);

        return {overallAverage, overallAcceleration, overallSpeed, overallBraking, overallCornering};
      }

      return {emptyDatabase, generateDummyData, getTripAverage, getOverallAverage, getTripHistory};
}