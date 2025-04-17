import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import paymentService from '../services/paymentService';

const AddPaymentMethodScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const formatCardNumber = (text) => {
    // Retirer tous les espaces
    const cleaned = text.replace(/\s/g, '');
    // Ajouter un espace tous les 4 chiffres
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted;
  };

  const handleCardNumberChange = (text) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  };

  const validateForm = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Erreur', 'Numéro de carte invalide');
      return false;
    }

    if (!expiryMonth || !expiryYear || expiryMonth.length !== 2 || expiryYear.length !== 2) {
      Alert.alert('Erreur', 'Date d\'expiration invalide');
      return false;
    }

    const month = parseInt(expiryMonth);
    if (month < 1 || month > 12) {
      Alert.alert('Erreur', 'Mois d\'expiration invalide');
      return false;
    }

    if (!cvv || cvv.length !== 3) {
      Alert.alert('Erreur', 'CVV invalide');
      return false;
    }

    if (!cardholderName) {
      Alert.alert('Erreur', 'Nom du titulaire requis');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await paymentService.addPaymentMethod({
        userId: user.id,
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiryMonth,
        expiryYear,
        cvv,
        cardholderName,
      });

      Alert.alert(
        'Succès',
        'Méthode de paiement ajoutée avec succès',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la méthode de paiement:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter la méthode de paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter une carte</Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Numéro de carte</Text>
          <TextInput
            style={styles.input}
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            maxLength={19} // 16 chiffres + 3 espaces
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Date d'expiration</Text>
            <View style={styles.expiryContainer}>
              <TextInput
                style={[styles.input, styles.expiryInput]}
                value={expiryMonth}
                onChangeText={setExpiryMonth}
                placeholder="MM"
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.expiryDivider}>/</Text>
              <TextInput
                style={[styles.input, styles.expiryInput]}
                value={expiryYear}
                onChangeText={setExpiryYear}
                placeholder="AA"
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              value={cvv}
              onChangeText={setCvv}
              placeholder="123"
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom du titulaire</Text>
          <TextInput
            style={styles.input}
            value={cardholderName}
            onChangeText={setCardholderName}
            placeholder="JEAN DUPONT"
            autoCapitalize="characters"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Ajouter la carte</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryInput: {
    flex: 1,
    textAlign: 'center',
  },
  expiryDivider: {
    fontSize: 20,
    marginHorizontal: 8,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddPaymentMethodScreen;
