import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ContactsList from '../components/ContactsList';

const CreateGroupScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [approvalRequired, setApprovalRequired] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        "Permission requise",
        "Nous avons besoin de votre permission pour accéder à la galerie."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setGroupImage(result.assets[0].uri);
    }
  };

  const handleContactSelect = useCallback((contact) => {
    setSelectedContacts(prev => {
      const isSelected = prev.find(c => c.id === contact.id);
      if (isSelected) {
        return prev.filter(c => c.id !== contact.id);
      }
      return [...prev, contact];
    });
  }, []);

  const createGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Erreur", "Le nom du groupe est requis");
      return;
    }

    if (selectedContacts.length < 2) {
      Alert.alert("Erreur", "Sélectionnez au moins 2 participants");
      return;
    }

    try {
      // Implémenter la création du groupe ici
      const groupData = {
        name: groupName,
        description,
        image: groupImage,
        members: selectedContacts,
        isPrivate,
        approvalRequired,
        createdAt: new Date(),
        admins: [/* ID de l'utilisateur actuel */],
      };

      // Envoyer au serveur et créer le groupe
      // await GroupService.createGroup(groupData);

      Alert.alert(
        "Succès",
        "Groupe créé avec succès",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Erreur", "Impossible de créer le groupe");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Nouveau Groupe</Text>
        <TouchableOpacity onPress={createGroup}>
          <Text style={styles.createButton}>Créer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={pickImage}>
          {groupImage ? (
            <Image source={{ uri: groupImage }} style={styles.groupImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={40} color="#666" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nom du groupe"
          value={groupName}
          onChangeText={setGroupName}
          maxLength={50}
        />

        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description du groupe (optionnel)"
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={200}
        />

        <View style={styles.settingItem}>
          <Text>Groupe privé</Text>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
          />
        </View>

        <View style={styles.settingItem}>
          <Text>Approbation requise pour rejoindre</Text>
          <Switch
            value={approvalRequired}
            onValueChange={setApprovalRequired}
          />
        </View>

        <Text style={styles.sectionTitle}>
          Participants sélectionnés ({selectedContacts.length})
        </Text>

        <ContactsList
          selectedContacts={selectedContacts}
          onContactSelect={handleContactSelect}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  createButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
  },
});

export default CreateGroupScreen;
