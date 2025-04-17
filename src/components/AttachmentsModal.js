import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AttachmentOption = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      <Ionicons name={icon} size={24} color="#fff" />
    </View>
    <Text style={styles.optionLabel}>{label}</Text>
  </TouchableOpacity>
);

const AttachmentsModal = ({ visible, onClose, onSelectOption }) => {
  const options = [
    {
      icon: 'image',
      label: 'Photo/Vidéo',
      color: '#4CAF50',
      action: 'image',
    },
    {
      icon: 'camera',
      label: 'Appareil photo',
      color: '#2196F3',
      action: 'camera',
    },
    {
      icon: 'document',
      label: 'Document',
      color: '#FF9800',
      action: 'document',
    },
    {
      icon: 'location',
      label: 'Position',
      color: '#E91E63',
      action: 'location',
    },
    {
      icon: 'person',
      label: 'Contact',
      color: '#9C27B0',
      action: 'contact',
    },
    {
      icon: 'musical-notes',
      label: 'Audio',
      color: '#795548',
      action: 'audio',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Pièces jointes</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsGrid}>
              {options.map((option, index) => (
                <AttachmentOption
                  key={index}
                  icon={option.icon}
                  label={option.label}
                  color={option.color}
                  onPress={() => {
                    onSelectOption(option.action);
                    onClose();
                  }}
                />
              ))}
            </View>
          </View>
        </SafeAreaView>
      </TouchableOpacity>
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  option: {
    width: (width - 80) / 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default AttachmentsModal;
