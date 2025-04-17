import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Image,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileEditScreen = ({ navigation, route }) => {
  const { profile, onUpdateProfile } = route.params;
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    onUpdateProfile(editedProfile);
    navigation.goBack();
  };

  const renderInputField = (label, key, placeholder, multiline = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          multiline && styles.multilineInput
        ]}
        value={editedProfile[key]}
        onChangeText={(text) => setEditedProfile({...editedProfile, [key]: text})}
        placeholder={placeholder}
        multiline={multiline}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le Profil</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <TouchableOpacity style={styles.avatarContainer}>
          <Image 
            source={{ uri: editedProfile.avatar }} 
            style={styles.avatar} 
          />
          <Text style={styles.changeAvatarText}>Changer la photo de profil</Text>
        </TouchableOpacity>

        {renderInputField('Nom d\'utilisateur', 'username', 'Votre nom')}
        {renderInputField('Statut', 'status', 'Votre statut actuel')}
        {renderInputField('Biographie', 'bio', 'Parlez-nous de vous', true)}
        {renderInputField('Localisation', 'location', 'Votre ville')}
        
        <View style={styles.socialLinksContainer}>
          <Text style={styles.sectionTitle}>Liens Sociaux</Text>
          {renderInputField('Instagram', 'socialLinks.instagram', '@mon_profile')}
          {renderInputField('Twitter', 'socialLinks.twitter', '@mon_tweet')}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    color: '#07C160',
    fontWeight: '600',
  },
  avatarContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changeAvatarText: {
    marginTop: 10,
    color: '#07C160',
  },
  inputContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  socialLinksContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    padding: 15,
    backgroundColor: 'white',
  },
});

export default ProfileEditScreen;
