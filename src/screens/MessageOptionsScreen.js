import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const MessageOptionsScreen = ({ navigation, route }) => {
  const [messageType, setMessageType] = useState('normal'); // normal, ephemeral, scheduled
  const [expirationTime, setExpirationTime] = useState(5); // minutes
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [quickReply, setQuickReply] = useState('');
  const [quickReplies, setQuickReplies] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');

  const handleSaveQuickReply = () => {
    if (!quickReply.trim()) {
      Alert.alert("Erreur", "La réponse rapide ne peut pas être vide");
      return;
    }
    setQuickReplies([...quickReplies, quickReply]);
    setQuickReply('');
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim() || !templateContent.trim()) {
      Alert.alert("Erreur", "Le nom et le contenu du modèle sont requis");
      return;
    }
    // Sauvegarder le modèle
    Alert.alert("Succès", "Modèle sauvegardé");
    setTemplateName('');
    setTemplateContent('');
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setScheduledDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Options de message</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Type de message</Text>
        <TouchableOpacity
          style={[styles.option, messageType === 'normal' && styles.selectedOption]}
          onPress={() => setMessageType('normal')}
        >
          <Text style={styles.optionText}>Normal</Text>
          {messageType === 'normal' && (
            <Ionicons name="checkmark" size={24} color="#007AFF" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, messageType === 'ephemeral' && styles.selectedOption]}
          onPress={() => setMessageType('ephemeral')}
        >
          <Text style={styles.optionText}>Message éphémère</Text>
          {messageType === 'ephemeral' && (
            <Ionicons name="checkmark" size={24} color="#007AFF" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, messageType === 'scheduled' && styles.selectedOption]}
          onPress={() => setMessageType('scheduled')}
        >
          <Text style={styles.optionText}>Message programmé</Text>
          {messageType === 'scheduled' && (
            <Ionicons name="checkmark" size={24} color="#007AFF" />
          )}
        </TouchableOpacity>
      </View>

      {messageType === 'ephemeral' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Durée d'expiration</Text>
          <View style={styles.timeSelector}>
            <TouchableOpacity
              style={[styles.timeOption, expirationTime === 5 && styles.selectedTime]}
              onPress={() => setExpirationTime(5)}
            >
              <Text style={styles.timeText}>5 min</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeOption, expirationTime === 60 && styles.selectedTime]}
              onPress={() => setExpirationTime(60)}
            >
              <Text style={styles.timeText}>1 heure</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeOption, expirationTime === 1440 && styles.selectedTime]}
              onPress={() => setExpirationTime(1440)}
            >
              <Text style={styles.timeText}>24 heures</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {messageType === 'scheduled' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Programmer l'envoi</Text>
          <TouchableOpacity
            style={styles.dateSelector}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {scheduledDate.toLocaleString()}
            </Text>
            <Ionicons name="calendar" size={24} color="#666" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={scheduledDate}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Réponses rapides</Text>
        <View style={styles.quickReplyInput}>
          <TextInput
            style={styles.input}
            placeholder="Ajouter une réponse rapide"
            value={quickReply}
            onChangeText={setQuickReply}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleSaveQuickReply}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {quickReplies.map((reply, index) => (
          <View key={index} style={styles.quickReplyItem}>
            <Text style={styles.quickReplyText}>{reply}</Text>
            <TouchableOpacity
              onPress={() => setQuickReplies(prev => prev.filter((_, i) => i !== index))}
            >
              <Ionicons name="trash" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Modèles de message</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom du modèle"
          value={templateName}
          onChangeText={setTemplateName}
        />
        <TextInput
          style={[styles.input, styles.templateInput]}
          placeholder="Contenu du modèle"
          value={templateContent}
          onChangeText={setTemplateContent}
          multiline
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveTemplate}
        >
          <Text style={styles.saveButtonText}>Sauvegarder le modèle</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
  },
  optionText: {
    fontSize: 16,
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeOption: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  selectedTime: {
    backgroundColor: '#e3f2fd',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
  },
  quickReplyInput: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#007AFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  quickReplyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  quickReplyText: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  templateInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MessageOptionsScreen;
