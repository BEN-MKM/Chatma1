import * as ExpoLocation from 'expo-location';

const Location = {
  requestPermissions: async () => {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  },

  getCurrentPosition: async () => {
    try {
      const hasPermission = await Location.requestPermissions();
      if (!hasPermission) return null;

      const location = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting current position:', error);
      return null;
    }
  },

  watchPosition: async (callback, options = {}) => {
    try {
      const hasPermission = await Location.requestPermissions();
      if (!hasPermission) return null;

      const subscription = await ExpoLocation.watchPositionAsync(
        {
          accuracy: ExpoLocation.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
          ...options,
        },
        (location) => {
          callback({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            timestamp: location.timestamp,
          });
        }
      );

      return subscription;
    } catch (error) {
      console.error('Error watching position:', error);
      return null;
    }
  },

  geocode: async (address) => {
    try {
      const results = await ExpoLocation.geocodeAsync(address);
      return results[0] || null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  },

  reverseGeocode: async (latitude, longitude) => {
    try {
      const results = await ExpoLocation.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      return results[0] || null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }
};

export default Location;
