import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const CallMessage = ({ call, onPress }) => {
  const { theme } = useTheme();
  const { type, status, duration, timestamp, isOutgoing } = call;

  const getCallIcon = () => {
    const iconColor = status === 'missed' ? '#FF3B30' : '#4CD964';
    const iconName = type === 'video' ? 'videocam' : 'call';
    const rotation = isOutgoing ? '0deg' : '135deg';

    return (
      <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
        <Ionicons 
          name={iconName} 
          size={16} 
          color="white" 
          style={{ transform: [{ rotate: rotation }] }}
        />
      </View>
    );
  };

  const getCallText = () => {
    const direction = isOutgoing ? 'Appel sortant' : 'Appel entrant';
    const typeText = type === 'video' ? 'vidéo' : 'vocal';
    
    if (status === 'missed') {
      return `${direction} ${typeText} manqué`;
    }
    
    return `${direction} ${typeText} · ${formatDuration(duration)}`;
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.messageBackground }]}
      onPress={onPress}
    >
      {getCallIcon()}
      <View style={styles.textContainer}>
        <Text style={[styles.callText, { color: theme.text }]}>
          {getCallText()}
        </Text>
        <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
          {formatTime(timestamp)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  callText: {
    fontSize: 15,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
  },
});

export default CallMessage;
