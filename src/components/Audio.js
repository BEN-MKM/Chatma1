import { Audio as ExpoAudio } from 'expo-av';

const Audio = {
  createSound: async (source) => {
    try {
      const { sound } = await ExpoAudio.Sound.createAsync(source);
      return sound;
    } catch (error) {
      console.error('Error creating sound:', error);
      return null;
    }
  },

  playSound: async (sound) => {
    try {
      if (!sound) return false;
      await sound.playAsync();
      return true;
    } catch (error) {
      console.error('Error playing sound:', error);
      return false;
    }
  },

  pauseSound: async (sound) => {
    try {
      if (!sound) return false;
      await sound.pauseAsync();
      return true;
    } catch (error) {
      console.error('Error pausing sound:', error);
      return false;
    }
  },

  stopSound: async (sound) => {
    try {
      if (!sound) return false;
      await sound.stopAsync();
      return true;
    } catch (error) {
      console.error('Error stopping sound:', error);
      return false;
    }
  },

  unloadSound: async (sound) => {
    try {
      if (!sound) return false;
      await sound.unloadAsync();
      return true;
    } catch (error) {
      console.error('Error unloading sound:', error);
      return false;
    }
  },

  setVolume: async (sound, volume) => {
    try {
      if (!sound) return false;
      await sound.setVolumeAsync(volume);
      return true;
    } catch (error) {
      console.error('Error setting volume:', error);
      return false;
    }
  },

  setIsLooping: async (sound, isLooping) => {
    try {
      if (!sound) return false;
      await sound.setIsLoopingAsync(isLooping);
      return true;
    } catch (error) {
      console.error('Error setting looping:', error);
      return false;
    }
  },

  getStatus: async (sound) => {
    try {
      if (!sound) return null;
      const status = await sound.getStatusAsync();
      return status;
    } catch (error) {
      console.error('Error getting status:', error);
      return null;
    }
  }
};

export default Audio;
