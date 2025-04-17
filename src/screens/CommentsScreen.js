import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CommentsScreen = ({ route, navigation }) => {
  const { postId, postData } = route.params;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      user: {
        username: 'user1',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      text: 'Super photo ! 😍',
      likes: 12,
      time: '2h',
    },
    {
      id: '2',
      user: {
        username: 'user2',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      text: 'Magnifique !',
      likes: 8,
      time: '3h',
    }
  ]);
  const inputRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Commentaires',
      headerLeft: () => (
        <TouchableOpacity 
          style={{ marginLeft: 16 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now().toString(),
        user: {
          username: 'currentUser',
          avatar: 'https://i.pravatar.cc/150?img=0',
        },
        text: comment,
        likes: 0,
        time: 'À l\'instant',
      };
      setComments(prev => [newComment, ...prev]);
      setComment('');
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.username}>{item.user.username}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.likeButton}>
            <Ionicons name="heart-outline" size={16} color="#666" />
            <Text style={styles.likesCount}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.replyButton}>
            <Text style={styles.replyText}>Répondre</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      {postData && (
        <View style={styles.postPreview}>
          <Image source={{ uri: postData.imageUrl }} style={styles.postImage} />
          <View style={styles.postInfo}>
            <Image source={{ uri: postData.userAvatar }} style={styles.postUserAvatar} />
            <Text style={styles.postUsername}>{postData.username}</Text>
          </View>
        </View>
      )}
      
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.commentsList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Ajouter un commentaire..."
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !comment.trim() && styles.sendButtonDisabled]}
          onPress={handleComment}
          disabled={!comment.trim()}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={comment.trim() ? "#007AFF" : "#999"} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postPreview: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  postInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  postUserAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  postUsername: {
    fontWeight: '600',
  },
  commentsList: {
    padding: 15,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontWeight: '600',
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000',
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  likesCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  replyButton: {
    padding: 4,
  },
  replyText: {
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 14,
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default CommentsScreen;
