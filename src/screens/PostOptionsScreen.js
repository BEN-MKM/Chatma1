import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PostOptionsScreen = ({ navigation, route }) => {
  const { postId } = route.params;

  const options = [
    { id: '1', title: 'Signaler', icon: 'flag-outline', color: '#FF3B30' },
    { id: '2', title: 'Ne plus suivre', icon: 'person-remove-outline', color: '#FF3B30' },
    { id: '3', title: 'Ajouter aux favoris', icon: 'star-outline', color: 'black' },
    { id: '4', title: 'Aller à la publication', icon: 'open-outline', color: 'black' },
    { id: '5', title: 'Partager', icon: 'share-outline', color: 'black' },
    { id: '6', title: 'Copier le lien', icon: 'link-outline', color: 'black' },
  ];

  const handleOption = (option) => {
    // Implémenter la logique pour chaque option
    console.log(`Selected option ${option.title} for post ${postId}`);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {options.map(option => (
        <TouchableOpacity 
          key={option.id}
          style={styles.option}
          onPress={() => handleOption(option)}
        >
          <Ionicons name={option.icon} size={24} color={option.color} />
          <Text style={[styles.optionText, { color: option.color }]}>
            {option.title}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity 
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelText}>Annuler</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 20,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 16,
    color: 'black',
  },
});

export default PostOptionsScreen;
