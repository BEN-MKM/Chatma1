import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatInfoScreen = ({ route, navigation }) => {
  const [chatInfo, setChatInfo] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const chatId = route.params?.chatId;
    if (!chatId) {
      Alert.alert('Erreur', 'Impossible de charger les informations du chat');
      navigation.goBack();
      return;
    }

    // Simuler le chargement des données du chat
    const loadChatInfo = async () => {
      try {
        // Remplacer par un vrai appel API
        const mockChatInfo = {
          id: chatId,
          name: 'Nom du chat',
          avatar: 'https://via.placeholder.com/150',
          isOnline: true,
          members: [],
          createdAt: new Date(),
          lastActivity: new Date()
        };
        
        setTimeout(() => {
          setChatInfo(mockChatInfo);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de charger les informations du chat');
        navigation.goBack();
      }
    };

    loadChatInfo();
  }, [route.params?.chatId, navigation]);

  const handleBlock = () => {
    Alert.alert(
      'Bloquer l\'utilisateur',
      'Voulez-vous vraiment bloquer cet utilisateur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Bloquer',
          style: 'destructive',
          onPress: () => setIsBlocked(true)
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2b5278" />
      </View>
    );
  }

  if (!chatInfo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Impossible de charger les informations</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: chatInfo.avatar }} 
          style={styles.avatar}
        />
        <Text style={styles.name}>{chatInfo.name}</Text>
        <Text style={styles.status}>
          {chatInfo.isOnline ? 'En ligne' : 'Hors ligne'}
        </Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.option}
          onPress={() => navigation.navigate('SearchMessages', { chatId: chatInfo.id })}
        >
          <Ionicons name="search" size={24} color="#2b5278" />
          <Text style={styles.optionText}>Rechercher dans la conversation</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.option}
          onPress={() => navigation.navigate('PinnedMessages', { chatId: chatInfo.id })}
        >
          <Ionicons name="pin" size={24} color="#2b5278" />
          <Text style={styles.optionText}>Messages épinglés</Text>
        </TouchableOpacity>

        <View style={styles.option}>
          <Ionicons name="notifications-off" size={24} color="#2b5278" />
          <Text style={styles.optionText}>Mettre en sourdine</Text>
          <Switch
            value={isMuted}
            onValueChange={setIsMuted}
            style={styles.switch}
          />
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity 
          style={[styles.option, styles.blockOption]}
          onPress={handleBlock}
        >
          <Ionicons name="ban" size={24} color="#ff3b30" />
          <Text style={[styles.optionText, styles.blockText]}>
            Bloquer l'utilisateur
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  linkText: {
    color: '#2b5278',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 15,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  switch: {
    marginLeft: 'auto',
  },
  blockOption: {
    marginTop: 20,
  },
  blockText: {
    color: '#ff3b30',
  },
});

export default ChatInfoScreen;
