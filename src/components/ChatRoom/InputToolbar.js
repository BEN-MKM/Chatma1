import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import AudioRecordButton from './AudioRecordButton';

const InputToolbar = ({
  onSend,
  onAttachmentPress,
  onStartRecording,
  onStopRecording,
  isRecording,
  isSending,
  placeholder = 'Message...',
}) => {
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(36);
  const inputRef = useRef(null);

  const handleSend = useCallback(() => {
    if (text.trim() && !isSending) {
      onSend(text.trim());
      setText('');
      setInputHeight(36);
    }
  }, [text, isSending, onSend]);

  const handleContentSizeChange = useCallback((event) => {
    const { height } = event.nativeEvent.contentSize;
    setInputHeight(Math.min(Math.max(36, height), 100));
  }, []);

  const handleAttachmentPress = useCallback(() => {
    Keyboard.dismiss();
    onAttachmentPress();
  }, [onAttachmentPress]);

  const renderBackground = () => {
    if (Platform.OS === 'ios') {
      return (
        <BlurView
          style={StyleSheet.absoluteFill}
          intensity={80}
          tint="light"
        />
      );
    }
    return <View style={[StyleSheet.absoluteFill, styles.androidBackground]} />;
  };

  return (
    <View style={styles.container}>
      {renderBackground()}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleAttachmentPress}
          disabled={isRecording || isSending}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={isRecording || isSending ? '#C7C7CC' : '#007AFF'}
          />
        </TouchableOpacity>

        <View style={styles.textInputContainer}>
          <TextInput
            ref={inputRef}
            style={[styles.input, { height: inputHeight }]}
            value={text}
            onChangeText={setText}
            placeholder={placeholder}
            placeholderTextColor="#8E8E93"
            multiline
            onContentSizeChange={handleContentSizeChange}
            editable={!isRecording && !isSending}
          />
        </View>

        {text.trim() ? (
          <TouchableOpacity
            style={styles.button}
            onPress={handleSend}
            disabled={isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <Ionicons name="send" size={24} color="#007AFF" />
            )}
          </TouchableOpacity>
        ) : (
          <AudioRecordButton
            onStartRecording={onStartRecording}
            onStopRecording={onStopRecording}
            isRecording={isRecording}
            disabled={isSending}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C6C6C8',
    minHeight: 50,
  },
  androidBackground: {
    backgroundColor: '#F6F6F6',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 8,
    zIndex: 1,
  },
  textInputContainer: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#C6C6C8',
    paddingHorizontal: 12,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  input: {
    fontSize: 16,
    lineHeight: 20,
    color: '#000',
    paddingTop: 8,
    paddingBottom: 8,
    maxHeight: 100,
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(InputToolbar);
