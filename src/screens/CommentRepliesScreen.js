import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const CommentRepliesScreen = ({ route, navigation }) => {
  const { comment } = route.params;
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState([
    {
      id: '1',
      user: 'Alice',
      text: 'Totalement d\'accord avec vous !',
      likes: 5,
      time: '2h',
    },
    {
      id: '2',
      user: 'Bob',
      text: 'Intéressant point de vue',
      likes: 3,
      time: '1h',
    },
  ]);

  const handleSendReply = () => {
    if (replyText.trim()) {
      const newReply = {
        id: Date.now().toString(),
        user: 'Vous',
        text: replyText,
        likes: 0,
        time: 'maintenant',
      };
      setReplies([newReply, ...replies]);
      setReplyText('');
    }
  };

  const renderReply = ({ item }) => (
    <View style={styles.replyContainer}>
      <View style={styles.replyHeader}>
        <Text style={styles.username}>{item.user}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Text style={styles.replyText}>{item.text}</Text>
      <View style={styles.replyActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={20} color="#666" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#666" />
          <Text style={styles.actionText}>Répondre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Réponses</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.originalComment}>
        <Text style={styles.commentUser}>{comment.user}</Text>
        <Text style={styles.commentText}>{comment.text}</Text>
      </View>

      <FlatList
        data={replies}
        renderItem={renderReply}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.repliesList}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Écrire une réponse..."
          value={replyText}
          onChangeText={setReplyText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !replyText.trim() && styles.sendButtonDisabled]}
          onPress={handleSendReply}
          disabled={!replyText.trim()}
        >
          <Ionicons name="send" size={24} color={replyText.trim() ? '#007AFF' : '#999'} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  originalComment: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentUser: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  commentText: {
    fontSize: 15,
    color: '#333',
  },
  repliesList: {
    padding: 15,
  },
  replyContainer: {
    marginBottom: 20,
  },
  replyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
  },
  time: {
    fontSize: 13,
    color: '#666',
  },
  replyText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  replyActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 13,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default CommentRepliesScreen;
