import React, { memo, useState, useCallback } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Platform,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MessageInput = ({ 
  value, 
  onChangeText, 
  onSend, 
  onAttachmentPress, 
  onVoicePress,
  isRecording 
}) => {
  const [inputHeight, setInputHeight] = useState(40);

  const handleSend = useCallback(() => {
    if (value.trim()) {
      onSend(value.trim());
      Keyboard.dismiss();
    }
  }, [value, onSend]);

  const handleContentSizeChange = useCallback((event) => {
    const { height } = event.nativeEvent.contentSize;
    setInputHeight(Math.min(Math.max(40, height), 100));
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={onAttachmentPress}
        style={styles.button}
      >
        <Ionicons name="attach" size={24} color="#666" />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, { height: inputHeight }]}
          placeholder="Message..."
          multiline
          onContentSizeChange={handleContentSizeChange}
          maxHeight={100}
        />
      </View>

      {value.trim() ? (
        <TouchableOpacity 
          onPress={handleSend}
          style={styles.button}
        >
          <Ionicons name="send" size={24} color="#0084ff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          onPress={onVoicePress}
          style={[styles.button, isRecording && styles.recording]}
        >
          <Ionicons 
            name={isRecording ? "stop-circle" : "mic"} 
            size={24} 
            color={isRecording ? "#ff0000" : "#666"} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
  },
  input: {
    fontSize: 16,
    lineHeight: 20,
    maxHeight: 100,
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recording: {
    backgroundColor: '#ffe0e0',
    borderRadius: 20,
  },
});

export default memo(MessageInput);
