import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SharePostScreen = ({ navigation, route }) => {
  const { postId } = route.params;
  
  const shareOptions = [
    { id: '1', title: 'Partager dans une story', icon: 'add-circle-outline' },
    { id: '2', title: 'Envoyer en message', icon: 'paper-plane-outline' },
    { id: '3', title: 'Copier le lien', icon: 'link-outline' },
    { id: '4', title: 'Partager sur...', icon: 'share-social-outline' },
  ];

  const handleShare = (option) => {
    // Implémenter la logique de partage selon l'option choisie
    console.log(`Sharing post ${postId} with option ${option.title}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Partager</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={shareOptions}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.option}
            onPress={() => handleShare(item)}
          >
            <Ionicons name={item.icon} size={24} color="black" />
            <Text style={styles.optionText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
  },
});

export default SharePostScreen;
