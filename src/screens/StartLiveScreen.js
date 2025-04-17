import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useTheme } from '@react-navigation/native';

const StartLiveScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Gaming');
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Gaming',
    'Discussion',
    'Music',
    'Education',
    'Sports',
  ];

  const startLiveStream = async () => {
    if (!title.trim()) {
      Alert.alert('Attention', 'Veuillez donner un titre à votre live');
      return;
    }

    setIsLoading(true);
    try {
      // Navigation vers l'écran de live avec les paramètres
      navigation.replace('LiveStream', {
        streamTitle: title,
        category: selectedCategory,
        isPrivate: isPrivate,
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de démarrer le live');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Nouveau Live</Text>
        <TouchableOpacity 
          style={[styles.startButton, (!title || isLoading) && styles.startButtonDisabled]}
          disabled={!title || isLoading}
          onPress={startLiveStream}
        >
          <Text style={styles.startButtonText}>
            {isLoading ? 'Chargement...' : 'Commencer'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Preview */}
      <View style={styles.previewContainer}>
        <TouchableOpacity 
          style={styles.cameraPreview}
          onPress={() => Alert.alert('Caméra', 'Accès à la caméra')}
        >
          <Ionicons name="camera" size={40} color="#666" />
          <Text style={styles.previewText}>Appuyez pour activer la caméra</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Titre du live</Text>
          <TextInput
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            placeholder="Donnez un titre à votre live..."
            placeholderTextColor="#666"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
          <Text style={styles.charCount}>{title.length}/50</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Description (optionnel)</Text>
          <TextInput
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            placeholder="Ajoutez une description..."
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={200}
          />
          <Text style={styles.charCount}>{description.length}/200</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Catégorie</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.selectedCategoryChip
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.selectedCategoryChipText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.settingContainer}>
          <View style={styles.settingLeft}>
            <Ionicons name="lock-closed-outline" size={24} color={theme.colors.text} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>Live privé</Text>
          </View>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isPrivate ? "#1DA1F2" : "#f4f3f4"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 5,
  },
  startButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  previewContainer: {
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPreview: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  previewText: {
    marginTop: 10,
    color: '#666',
  },
  form: {
    padding: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  categoryChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryChip: {
    backgroundColor: '#1DA1F2',
  },
  categoryChipText: {
    color: '#666',
  },
  selectedCategoryChipText: {
    color: 'white',
  },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default StartLiveScreen;
