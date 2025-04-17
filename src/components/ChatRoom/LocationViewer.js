import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LocationViewer = ({ latitude, longitude, onPress }) => {
  // Calculer les dimensions de la carte
  const { width } = Dimensions.get('window');
  const mapWidth = Math.min(width * 0.7, 300);
  const mapHeight = mapWidth * 0.6;

  // Générer l'URL de l'image statique de la carte
  const getMapImageUrl = () => {
    // Pour la production, utilisez un service de cartes avec une clé API
    // Exemple avec Google Maps Static API :
    // return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=${mapWidth}x${mapHeight}&markers=color:red%7C${latitude},${longitude}&key=YOUR_API_KEY`;
    
    // Pour le développement, on utilise OpenStreetMap (pas besoin de clé API)
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=15&size=${Math.floor(mapWidth)}x${Math.floor(mapHeight)}&markers=${latitude},${longitude},red`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: getMapImageUrl() }}
        style={[styles.map, { width: mapWidth, height: mapHeight }]}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Ionicons
          name="location"
          size={24}
          color="#007AFF"
          style={styles.icon}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F6F6F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  map: {
    borderRadius: 12,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  icon: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default React.memo(LocationViewer);
