import { Asset } from 'expo-asset';
import { Image } from 'react-native';

export const loadImages = async () => {
  const images = [];

  const cacheImages = images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });

  await Promise.all(cacheImages);
};
