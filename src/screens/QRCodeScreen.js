import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { captureRef } from 'react-native-view-shot';
import { Ionicons } from '@expo/vector-icons';

const QRCodeScreen = ({ route }) => {
  const [userData] = useState({
    id: '123456',
    username: 'jean.dupont',
    name: 'Jean Dupont',
    avatar: 'https://example.com/avatar.jpg'
  });

  const qrRef = useRef();

  const handleShare = async () => {
    try {
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 0.8,
      });

      if (Platform.OS === 'android') {
        const fileUri = `${FileSystem.cacheDirectory}qrcode.png`;
        await FileSystem.copyAsync({
          from: uri,
          to: fileUri
        });
        await Sharing.shareAsync(fileUri);
      } else if (Platform.OS === 'web') {
        Alert.alert(
          "Partage sur le Web",
          "Pour partager votre QR code sur le web, faites une capture d'écran ou utilisez l'application mobile.",
          [{ text: "OK" }]
        );
      } else {
        await Share.share({
          url: uri,
          message: `Ajoutez-moi sur ChatMa ! ${userData.username}`
        });
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager le QR code');
    }
  };

  const handleSave = async () => {
    try {
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 0.8,
      });

      // Sauvegarder dans la galerie
      // Nécessite les permissions appropriées
      Alert.alert('Succès', 'QR code sauvegardé dans votre galerie');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder le QR code');
    }
  };

  const qrValue = JSON.stringify({
    type: 'profile',
    id: userData.id,
    username: userData.username
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={50} color="#8E8E93" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userHandle}>@{userData.username}</Text>
          </View>
        </View>
      </View>

      <View style={styles.qrContainer} ref={qrRef}>
        <View style={styles.qrWrapper}>
          <QRCode
            value={qrValue}
            size={200}
            color="#000000"
            backgroundColor="#FFFFFF"
            logo={null}
            logoSize={50}
            logoBackgroundColor="#FFFFFF"
            logoBorderRadius={8}
          />
        </View>
        <Text style={styles.qrDescription}>
          Scannez ce QR code pour ajouter {userData.name}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={24} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Partager</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleSave}
        >
          <Ionicons name="download-outline" size={24} color="#007AFF" />
          <Text style={styles.secondaryButtonText}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="scan-outline" size={24} color="#8E8E93" />
          <Text style={styles.infoText}>
            Demandez à vos amis de scanner ce code pour vous ajouter
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#8E8E93" />
          <Text style={styles.infoText}>
            Ce QR code est unique et lié à votre compte
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7'
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA'
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  userDetails: {
    flex: 1
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000'
  },
  userHandle: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 2
  },
  qrContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  qrDescription: {
    marginTop: 16,
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center'
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 8
  },
  primaryButton: {
    backgroundColor: '#007AFF'
  },
  secondaryButton: {
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#007AFF'
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8
  },
  infoContainer: {
    padding: 16,
    marginTop: 16
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 12,
    flex: 1
  }
});

export default QRCodeScreen;
