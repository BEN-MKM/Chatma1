import * as ExpoLinking from 'expo-linking';

const Linking = {
  openURL: async (url) => {
    try {
      const supported = await ExpoLinking.canOpenURL(url);
      if (supported) {
        await ExpoLinking.openURL(url);
        return true;
      }
      console.warn(`Cannot open URL: ${url}`);
      return false;
    } catch (error) {
      console.error('Error opening URL:', error);
      return false;
    }
  },

  makePhoneCall: async (phoneNumber) => {
    try {
      const url = `tel:${phoneNumber}`;
      return await Linking.openURL(url);
    } catch (error) {
      console.error('Error making phone call:', error);
      return false;
    }
  },

  sendEmail: async (email, subject = '', body = '') => {
    try {
      const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return await Linking.openURL(url);
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  },

  openMaps: async (latitude, longitude, label = '') => {
    try {
      const url = Platform.select({
        ios: `maps:${latitude},${longitude}?q=${encodeURIComponent(label)}`,
        android: `geo:${latitude},${longitude}?q=${encodeURIComponent(label)}`,
      });
      return await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening maps:', error);
      return false;
    }
  }
};

export default Linking;
