import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const AttachmentOption = ({ icon, label, onPress, theme, color }) => (
  <TouchableOpacity
    style={styles.option}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.iconContainer, { backgroundColor: color || theme?.primary || '#007AFF' }]}>
      <Ionicons name={icon} size={24} color="#FFFFFF" />
    </View>
    <Text style={[styles.optionLabel, { color: theme?.text || '#000000' }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const AttachmentMenu = ({
  isVisible,
  onClose,
  onPickImage,
  onTakePhoto,
  onPickDocument,
  onShareLocation,
  onShareContact
}) => {
  const theme = useTheme();

  const options = [
    {
      icon: 'image',
      label: 'Galerie',
      onPress: onPickImage,
      color: '#4CAF50'
    },
    {
      icon: 'camera',
      label: 'Photo',
      onPress: onTakePhoto,
      color: '#2196F3'
    },
    {
      icon: 'document-text',
      label: 'Document',
      onPress: onPickDocument,
      color: '#FF9800'
    },
    {
      icon: 'location',
      label: 'Position',
      onPress: onShareLocation,
      color: '#F44336'
    },
    {
      icon: 'person',
      label: 'Contact',
      onPress: onShareContact,
      color: '#9C27B0'
    }
  ];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable 
          style={[styles.container, { backgroundColor: theme?.background || '#FFFFFF' }]}
          onPress={e => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme?.text || '#000000' }]}>
              Partager
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme?.text || '#000000'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <AttachmentOption
                key={index}
                icon={option.icon}
                label={option.label}
                onPress={option.onPress}
                theme={theme}
                color={option.color}
              />
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-around',
  },
  option: {
    width: '25%',
    alignItems: 'center',
    marginVertical: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default AttachmentMenu;
