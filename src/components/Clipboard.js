import * as ExpoClipboard from 'expo-clipboard';

const Clipboard = {
  setString: async (text) => {
    try {
      await ExpoClipboard.setStringAsync(text);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  },

  getString: async () => {
    try {
      const text = await ExpoClipboard.getStringAsync();
      return text;
    } catch (error) {
      console.error('Error getting clipboard content:', error);
      return null;
    }
  },

  hasString: async () => {
    try {
      const hasString = await ExpoClipboard.hasStringAsync();
      return hasString;
    } catch (error) {
      console.error('Error checking clipboard content:', error);
      return false;
    }
  }
};

export default Clipboard;
