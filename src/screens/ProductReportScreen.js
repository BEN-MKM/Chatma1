import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductReportScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [selectedReason, setSelectedReason] = useState(null);
  const [description, setDescription] = useState('');

  const reasons = [
    { id: 1, label: 'Produit contrefait' },
    { id: 2, label: 'Prix trompeur' },
    { id: 3, label: 'Description mensongère' },
    { id: 4, label: 'Produit dangereux' },
    { id: 5, label: 'Contenu inapproprié' },
    { id: 6, label: 'Autre' },
  ];

  const handleSubmit = async () => {
    if (!selectedReason) {
      Alert.alert('Erreur', 'Veuillez sélectionner une raison');
      return;
    }

    try {
      // Simuler l'envoi du signalement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Merci',
        'Votre signalement a été envoyé. Nous allons l\'examiner dans les plus brefs délais.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>Signaler un produit</Text>
          <Text style={styles.subtitle}>
            Aidez-nous à maintenir un environnement sûr en signalant tout contenu suspect.
          </Text>

          <View style={styles.reasonsContainer}>
            <Text style={styles.sectionTitle}>Raison du signalement</Text>
            {reasons.map((reason) => (
              <TouchableOpacity
                key={reason.id}
                style={[
                  styles.reasonItem,
                  selectedReason?.id === reason.id && styles.selectedReason,
                ]}
                onPress={() => setSelectedReason(reason)}
              >
                <Text
                  style={[
                    styles.reasonText,
                    selectedReason?.id === reason.id && styles.selectedReasonText,
                  ]}
                >
                  {reason.label}
                </Text>
                {selectedReason?.id === reason.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#FF4D4F" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description (optionnelle)</Text>
            <TextInput
              style={styles.descriptionInput}
              multiline
              numberOfLines={4}
              placeholder="Décrivez le problème en détail..."
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, !selectedReason && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!selectedReason}
          >
            <Text style={styles.submitButtonText}>Envoyer le signalement</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Nous prenons les signalements très au sérieux. Toute fausse déclaration peut entraîner des sanctions.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    lineHeight: 20,
  },
  reasonsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  reasonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedReason: {
    backgroundColor: '#FFE8E8',
    borderColor: '#FF4D4F',
    borderWidth: 1,
  },
  reasonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedReasonText: {
    color: '#FF4D4F',
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginBottom: 30,
  },
  descriptionInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    height: 120,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#FF4D4F',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ProductReportScreen;
