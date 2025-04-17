import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { chatService } from '../services/ChatService';
import supabase from '../config/supabase';
import debounce from 'lodash/debounce';

const NewChatScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  // Fonction de recherche
  const searchUsers = useCallback(async (query) => {
    if (query.length < 2) {
      setUsers([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .neq('id', user.id)
        .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
        .limit(20);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erreur recherche utilisateurs:', error);
      Alert.alert('Erreur', 'Impossible de rechercher les utilisateurs');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Création du debounce avec useMemo
  const debouncedSearch = useMemo(
    () => debounce(searchUsers, 300),
    [searchUsers]
  );

  // Nettoyage du debounce à la destruction du composant
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Effet pour la recherche
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const toggleUserSelection = useCallback((selectedUser) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === selectedUser.id);
      if (isSelected) {
        return prev.filter(u => u.id !== selectedUser.id);
      }
      return [...prev, selectedUser];
    });
  }, []);

  const startChat = async () => {
    if (selectedUsers.length === 0) return;

    setIsCreatingChat(true);
    try {
      const participants = [user.id, ...selectedUsers.map(u => u.id)];
      const type = selectedUsers.length > 1 ? 'group' : 'private';
      
      const conversation = await chatService.createConversation(participants, type);
      
      navigation.replace('ChatRoom', {
        conversationId: conversation.id,
        participants: selectedUsers,
        type
      });
    } catch (error) {
      console.error('Erreur création conversation:', error);
      Alert.alert('Erreur', 'Impossible de créer la conversation');
    } finally {
      setIsCreatingChat(false);
    }
  };

  const renderUser = useCallback(({ item }) => {
    const isSelected = selectedUsers.some(u => u.id === item.id);

    return (
      <TouchableOpacity
        style={[
          styles.userItem,
          isSelected && styles.selectedUserItem,
          { backgroundColor: isSelected ? theme.colors.primary + '20' : theme.colors.background }
        ]}
        onPress={() => toggleUserSelection(item)}
      >
        {item.avatar_url ? (
          <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.border }]}>
            <Text style={[styles.avatarText, { color: theme.colors.text }]}>
              {item.username?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={[styles.username, { color: theme.colors.text }]}>
            {item.username}
          </Text>
          {item.full_name && (
            <Text style={[styles.fullName, { color: theme.colors.placeholder }]}>
              {item.full_name}
            </Text>
          )}
        </View>
        {isSelected && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={theme.colors.primary}
            style={styles.checkIcon}
          />
        )}
      </TouchableOpacity>
    );
  }, [selectedUsers, theme, toggleUserSelection]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Nouvelle conversation
        </Text>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={startChat}
          disabled={selectedUsers.length === 0 || isCreatingChat}
        >
          {isCreatingChat ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Text
              style={[
                styles.nextButtonText,
                { color: theme.colors.primary },
                selectedUsers.length === 0 && { opacity: 0.5 }
              ]}
            >
              Suivant
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <Ionicons
          name="search"
          size={20}
          color={theme.colors.placeholder}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Rechercher des utilisateurs..."
          placeholderTextColor={theme.colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
      </View>

      {selectedUsers.length > 0 && (
        <View style={styles.selectedUsersContainer}>
          <FlatList
            data={selectedUsers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.selectedUserChip, { backgroundColor: theme.colors.primary }]}
                onPress={() => toggleUserSelection(item)}
              >
                <Text style={styles.selectedUserText} numberOfLines={1}>
                  {item.username}
                </Text>
                <Ionicons name="close-circle" size={20} color="#FFF" />
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.userList}
        ListEmptyComponent={() => (
          !loading && searchQuery.length >= 2 && (
            <Text style={[styles.emptyText, { color: theme.colors.placeholder }]}>
              Aucun utilisateur trouvé
            </Text>
          )
        )}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  nextButton: {
    padding: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  selectedUsersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  selectedUserChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedUserText: {
    color: '#FFF',
    marginRight: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  userList: {
    paddingHorizontal: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedUserItem: {
    borderRadius: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
  },
  fullName: {
    fontSize: 14,
    marginTop: 2,
  },
  checkIcon: {
    marginLeft: 8,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default NewChatScreen;
