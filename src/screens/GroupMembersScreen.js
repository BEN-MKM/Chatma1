import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { defaultAvatar } from '../assets';

const GroupMembersScreen = ({ navigation, route }) => {
  const { groupId } = route.params;
  const [members, setMembers] = useState([
    {
      id: '1',
      name: 'John Doe',
      avatar: 'https://example.com/avatar1.jpg',
      isAdmin: true,
      isOwner: true,
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://example.com/avatar2.jpg',
      isAdmin: true,
      isOwner: false,
    },
    // ... autres membres
  ]);

  const handlePromoteToAdmin = useCallback((memberId) => {
    Alert.alert(
      "Promouvoir en administrateur",
      "Voulez-vous promouvoir ce membre en administrateur ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Promouvoir",
          onPress: async () => {
            try {
              setMembers(prev =>
                prev.map(member =>
                  member.id === memberId
                    ? { ...member, isAdmin: true }
                    : member
                )
              );
            } catch (error) {
              Alert.alert("Erreur", "Impossible de promouvoir le membre");
            }
          },
        },
      ]
    );
  }, []);

  const handleRemoveFromAdmin = useCallback((memberId) => {
    Alert.alert(
      "Retirer des administrateurs",
      "Voulez-vous retirer ce membre des administrateurs ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Retirer",
          style: "destructive",
          onPress: async () => {
            try {
              setMembers(prev =>
                prev.map(member =>
                  member.id === memberId
                    ? { ...member, isAdmin: false }
                    : member
                )
              );
            } catch (error) {
              Alert.alert("Erreur", "Impossible de retirer l'administrateur");
            }
          },
        },
      ]
    );
  }, []);

  const handleRemoveFromGroup = useCallback((memberId) => {
    Alert.alert(
      "Retirer du groupe",
      "Voulez-vous retirer ce membre du groupe ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Retirer",
          style: "destructive",
          onPress: async () => {
            try {
              setMembers(prev => prev.filter(member => member.id !== memberId));
            } catch (error) {
              Alert.alert("Erreur", "Impossible de retirer le membre");
            }
          },
        },
      ]
    );
  }, []);

  const renderMemberItem = useCallback(({ item }) => (
    <View style={styles.memberItem}>
      <Image
        source={item.avatar ? { uri: item.avatar } : defaultAvatar}
        style={styles.avatar}
      />
      
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberStatus}>
          {item.isOwner ? 'Créateur' : item.isAdmin ? 'Admin' : 'Membre'}
        </Text>
      </View>

      {!item.isOwner && (
        <View style={styles.actionButtons}>
          {item.isAdmin ? (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleRemoveFromAdmin(item.id)}
            >
              <Ionicons name="shield-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handlePromoteToAdmin(item.id)}
            >
              <Ionicons name="shield" size={24} color="#007AFF" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleRemoveFromGroup(item.id)}
          >
            <Ionicons name="remove-circle" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  ), [handlePromoteToAdmin, handleRemoveFromAdmin, handleRemoveFromGroup]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Membres du groupe</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddMembers', { groupId })}>
          <Ionicons name="person-add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={members}
        renderItem={renderMemberItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
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
  list: {
    padding: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
  },
  memberStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default GroupMembersScreen;
