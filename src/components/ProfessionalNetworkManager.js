import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfessionalNetworkManager = () => {
  const [connections, setConnections] = useState([
    {
      id: '1',
      name: 'Marie Dupont',
      title: 'Software Engineer',
      company: 'Tech Innovations',
      avatar: 'https://via.placeholder.com/50'
    },
    {
      id: '2',
      name: 'Pierre Martin',
      title: 'Product Manager',
      company: 'Digital Solutions',
      avatar: 'https://via.placeholder.com/50'
    }
  ]);

  const renderConnection = ({ item }) => (
    <View style={styles.connectionItem}>
      <Image 
        source={{ uri: item.avatar }} 
        style={styles.connectionAvatar} 
      />
      <View style={styles.connectionDetails}>
        <Text style={styles.connectionName}>{item.name}</Text>
        <Text style={styles.connectionTitle}>
          {item.title} @ {item.company}
        </Text>
      </View>
      <TouchableOpacity style={styles.connectionAction}>
        <Ionicons name="chatbubble-outline" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Réseau Professionnel</Text>
        <TouchableOpacity>
          <Text style={styles.addButton}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={connections}
        renderItem={renderConnection}
        keyExtractor={item => item.id}
        style={styles.connectionsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    padding: 15
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  addButton: {
    color: '#007AFF',
    fontSize: 16
  },
  connectionsList: {
    marginTop: 10
  },
  connectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5'
  },
  connectionAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15
  },
  connectionDetails: {
    flex: 1
  },
  connectionName: {
    fontSize: 16,
    fontWeight: '600'
  },
  connectionTitle: {
    fontSize: 14,
    color: '#666'
  },
  connectionAction: {
    padding: 10
  }
});

export default ProfessionalNetworkManager;
