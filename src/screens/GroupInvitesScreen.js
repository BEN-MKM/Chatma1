import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { defaultAvatar } from '../assets';

const GroupInvitesScreen = ({ navigation, route }) => {
  const { groupId } = route.params;
  const [invites, setInvites] = useState([
    {
      id: '1',
      user: {
        id: 'u1',
        name: 'Alice Johnson',
        avatar: 'https://example.com/avatar1.jpg',
      },
      status: 'pending',
      invitedBy: {
        id: 'u2',
        name: 'Bob Smith',
      },
      date: '2025-02-26T05:14:12.000Z',
    },
    // ... autres invitations
  ]);

  const handleAcceptInvite = useCallback(async (inviteId) => {
    try {
      // await GroupService.acceptInvite(groupId, inviteId);
      setInvites(prev =>
        prev.map(invite =>
          invite.id === inviteId
            ? { ...invite, status: 'accepted' }
            : invite
        )
      );
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'accepter l'invitation");
    }
  }, []);

  const handleRejectInvite = useCallback(async (inviteId) => {
    try {
      // await GroupService.rejectInvite(groupId, inviteId);
      setInvites(prev =>
        prev.map(invite =>
          invite.id === inviteId
            ? { ...invite, status: 'rejected' }
            : invite
        )
      );
    } catch (error) {
      Alert.alert("Erreur", "Impossible de rejeter l'invitation");
    }
  }, []);

  const handleCancelInvite = useCallback(async (inviteId) => {
    try {
      // await GroupService.cancelInvite(groupId, inviteId);
      setInvites(prev => prev.filter(invite => invite.id !== inviteId));
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'annuler l'invitation");
    }
  }, []);

  const renderInviteItem = useCallback(({ item }) => {
    const inviteDate = new Date(item.date);
    
    return (
      <View style={styles.inviteItem}>
        <Image
          source={item.user.avatar ? { uri: item.user.avatar } : defaultAvatar}
          style={styles.avatar}
        />
        
        <View style={styles.inviteInfo}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.inviteDetails}>
            Invité par {item.invitedBy.name} • {inviteDate.toLocaleDateString()}
          </Text>
        </View>

        {item.status === 'pending' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleAcceptInvite(item.id)}
            >
              <Ionicons name="checkmark" size={24} color="#4CAF50" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleRejectInvite(item.id)}
            >
              <Ionicons name="close" size={24} color="#FF3B30" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleCancelInvite(item.id)}
            >
              <Ionicons name="trash" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        {item.status !== 'pending' && (
          <View style={styles.statusContainer}>
            <Text style={[
              styles.statusText,
              item.status === 'accepted' ? styles.acceptedText : styles.rejectedText
            ]}>
              {item.status === 'accepted' ? 'Accepté' : 'Rejeté'}
            </Text>
          </View>
        )}
      </View>
    );
  }, [handleAcceptInvite, handleRejectInvite, handleCancelInvite]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Invitations en attente</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('InviteMembers', { groupId })}
        >
          <Ionicons name="person-add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={invites}
        renderItem={renderInviteItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Aucune invitation en attente
            </Text>
          </View>
        )}
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
  inviteItem: {
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
  inviteInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  inviteDetails: {
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
  acceptButton: {
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
  },
  rejectButton: {
    backgroundColor: '#ffebee',
    borderRadius: 20,
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  acceptedText: {
    color: '#4CAF50',
  },
  rejectedText: {
    color: '#FF3B30',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default GroupInvitesScreen;
