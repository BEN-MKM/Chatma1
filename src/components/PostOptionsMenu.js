import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

const PostOptionsMenu = ({ visible, onClose, onOption, post }) => {
  const theme = useTheme();

  const options = [
    {
      id: 'save',
      icon: 'bookmark-outline',
      label: 'Enregistrer',
      action: () => onOption('save')
    },
    {
      id: 'share',
      icon: 'share-outline',
      label: 'Partager',
      action: () => onOption('share')
    },
    {
      id: 'report',
      icon: 'flag-outline',
      label: 'Signaler',
      action: () => onOption('report')
    },
    {
      id: 'follow',
      icon: 'person-add-outline',
      label: 'Suivre l\'utilisateur',
      action: () => onOption('follow')
    },
    {
      id: 'block',
      icon: 'ban-outline',
      label: 'Bloquer l\'utilisateur',
      action: () => onOption('block'),
      destructive: true
    },
    {
      id: 'hide',
      icon: 'eye-off-outline',
      label: 'Masquer',
      action: () => onOption('hide')
    },
    // Option de suppression uniquement pour les posts de l'utilisateur actuel
    ...(post?.isOwnPost ? [
      {
        id: 'delete',
        icon: 'trash-outline',
        label: 'Supprimer',
        action: () => onOption('delete'),
        destructive: true
      }
    ] : [])
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.menuContainer, { backgroundColor: theme.colors.card }]}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Options</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsList}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionItem, option.destructive && styles.destructiveOption]}
                onPress={() => {
                  option.action();
                  onClose();
                }}
              >
                <Ionicons name={option.icon} size={24} color={option.destructive ? 'red' : theme.colors.text} />
                <Text style={[styles.optionText, { color: option.destructive ? 'red' : theme.colors.text }]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
  menuContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionsList: {
    padding: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  destructiveOption: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 16,
  },
});

export default PostOptionsMenu;
