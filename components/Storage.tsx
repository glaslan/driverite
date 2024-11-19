import AsyncStorage from '@react-native-async-storage/async-storage';

// Saves any form of data to the async storage.
export async function SaveObjectToStorage(key: string, value: object) {
	try {
		const valueAsJson = JSON.stringify(value);
		await AsyncStorage.setItem(key, valueAsJson);
	} catch (e) {
		// Error
	}
}

// Loads any form of data from the async storage with the specified key.
export async function LoadObjectFromStorage(key: string) {
	try {
		const valueAsJson = await AsyncStorage.getItem(key);
		return valueAsJson != null ? JSON.parse(valueAsJson) : null;
	} catch (e) {
		// Error
	}
}