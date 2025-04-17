import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const GroupSettingsScreen = ({ navigation, route }) => {
  const { groupId } = route.params;
  const [groupInfo, setGroupInfo] = useState({
    name: "Nom du groupe",
    description: "Description du groupe",
    image: null,
    memberCount: 25,
    adminCount: 3,
    isPrivate: true,
    approvalRequired: true,
    muteNotifications: false,
    allowMembersInvite: true,
    onlyAdminsMessage: false,
  });

  const updateGroupSetting = async (setting, value) => {
    try {
      // Simuler une mise à jour vers le serveur
      setGroupInfo(prev => ({ ...prev, [setting]: value }));
      // await GroupService.updateSettings(groupId, { [setting]: value });
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour les paramètres");
    }
  };

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
      setGroupInfo(prev => ({ ...prev, image: result.assets[0].uri }));
      // Uploader l'image
      // await GroupService.updateGroupImage(groupId, result.assets[0].uri);
    }
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      "Quitter le groupe",
      "Êtes-vous sûr de vouloir quitter ce groupe ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Quitter",
          style: "destructive",
          onPress: async () => {
            try {
              // await GroupService.leaveGroup(groupId);
              navigation.navigate('ChatList');
            } catch (error) {
              Alert.alert("Erreur", "Impossible de quitter le groupe");
            }
          },
        },
      ]
    );
  };

  const handleDeleteGroup = () => {
    Alert.alert(
      "Supprimer le groupe",
      "Cette action est irréversible. Êtes-vous sûr ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              // await GroupService.deleteGroup(groupId);
              navigation.navigate('ChatList');
            } catch (error) {
              Alert.alert("Erreur", "Impossible de supprimer le groupe");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Paramètres du groupe</Text>
        <View style={{ width: 24 }} />
      </View>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {groupInfo.image ? (
          <Image source={{ uri: groupInfo.image }} style={styles.groupImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera" size={40} color="#666" />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.infoSection}>
        <Text style={styles.infoText}>
          {groupInfo.memberCount} membres • {groupInfo.adminCount} administrateurs
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres de confidentialité</Text>
        
        <View style={styles.settingItem}>
          <Text>Groupe privé</Text>
          <Switch
            value={groupInfo.isPrivate}
            onValueChange={(value) => updateGroupSetting('isPrivate', value)}
          />
        </View>

        <View style={styles.settingItem}>
          <Text>Approbation requise pour rejoindre</Text>
          <Switch
            value={groupInfo.approvalRequired}
            onValueChange={(value) => updateGroupSetting('approvalRequired', value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres des notifications</Text>
        
        <View style={styles.settingItem}>
          <Text>Désactiver les notifications</Text>
          <Switch
            value={groupInfo.muteNotifications}
            onValueChange={(value) => updateGroupSetting('muteNotifications', value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres des messages</Text>
        
        <View style={styles.settingItem}>
          <Text>Autoriser les invitations par les membres</Text>
          <Switch
            value={groupInfo.allowMembersInvite}
            onValueChange={(value) => updateGroupSetting('allowMembersInvite', value)}
          />
        </View>

        <View style={styles.settingItem}>
          <Text>Seuls les admins peuvent envoyer des messages</Text>
          <Switch
            value={groupInfo.onlyAdminsMessage}
            onValueChange={(value) => updateGroupSetting('onlyAdminsMessage', value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('GroupMembers', { groupId })}
        >
          <Text style={styles.buttonText}>Gérer les membres</Text>
          <Ionicons name="chevron-forward" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('GroupInvites', { groupId })}
        >
          <Text style={styles.buttonText}>Invitations en attente</Text>
          <Ionicons name="chevron-forward" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.dangerSection}>
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleLeaveGroup}
        >
          <Text style={styles.dangerButtonText}>Quitter le groupe</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dangerButton, styles.deleteButton]}
          onPress={handleDeleteGroup}
        >
          <Text style={styles.dangerButtonText}>Supprimer le groupe</Text>
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
  infoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  dangerSection: {
    padding: 16,
  },
  dangerButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffebee',
    marginBottom: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff1744',
  },
  dangerButtonText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GroupSettingsScreen;
