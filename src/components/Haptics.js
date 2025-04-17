import * as ExpoHaptics from 'expo-haptics';

const Haptics = {
  impact: async (style = 'medium') => {
    try {
      switch (style) {
        case 'light':
          await ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light);
          break;
        case 'heavy':
          await ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Heavy);
          break;
        default:
          await ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.warn('Haptics not available:', error);
    }
  },

  notification: async (type = 'success') => {
    try {
      switch (type) {
        case 'error':
          await ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error);
          break;
        case 'warning':
          await ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Warning);
          break;
        default:
          await ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.warn('Haptics not available:', error);
    }
  },

  selection: async () => {
    try {
      await ExpoHaptics.selectionAsync();
    } catch (error) {
      console.warn('Haptics not available:', error);
    }
  }
};

export default Haptics;
