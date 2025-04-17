import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RechargeScreen = ({ navigation, route }) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const paymentMethods = [
    {
      id: 'card',
      title: 'Carte Bancaire',
      icon: 'card-outline',
      description: 'Visa, Mastercard, CB'
    },
    {
      id: 'bank',
      title: 'Virement Bancaire',
      icon: 'business-outline',
      description: 'Directement depuis votre compte'
    },
    {
      id: 'mobile',
      title: 'Paiement Mobile',
      icon: 'phone-portrait-outline',
      description: 'Orange Money, Wave, Free Money'
    },
    {
      id: 'cash',
      title: 'Point de Recharge',
      icon: 'location-outline',
      description: 'Trouvez un point de recharge près de chez vous'
    }
  ];

  const quickAmounts = [10, 20, 50, 100, 200, 500];

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // Limite à 16 chiffres + 3 espaces
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    if (method.id === 'card') {
      setShowCardModal(true);
    } else if (method.id === 'bank') {
      Alert.alert(
        'Informations de Virement',
        'IBAN: FR76 3000 1007 1234 5678 9012 345\nBIC: SOGEFRPP\nBénéficiaire: ChatMa Pay\n\nVotre virement sera crédité sous 24-48h.'
      );
    } else if (method.id === 'mobile') {
      Alert.alert(
        'Paiement Mobile',
        'Choisissez votre opérateur:\n\n• Orange Money: *144#\n• Wave: *707#\n• Free Money: *555#\n\nSuivez les instructions pour recharger votre compte.'
      );
    } else if (method.id === 'cash') {
      navigation.navigate('RechargePoints');
    }
  };

  const handleCardPayment = () => {
    if (!cardNumber || !expiryDate || !cvv || !amount) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    Alert.alert(
      'Confirmation',
      `Voulez-vous recharger votre compte de ${amount}€ ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            // Simuler le paiement
            setTimeout(() => {
              Alert.alert(
                'Succès',
                'Votre compte a été rechargé avec succès!',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      setShowCardModal(false);
                      navigation.goBack();
                    }
                  }
                ]
              );
            }, 1500);
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recharger mon compte</Text>
      </View>

      <View style={styles.amountSection}>
        <Text style={styles.sectionTitle}>Montant à recharger</Text>
        <View style={styles.amountContainer}>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Text style={styles.currencyText}>€</Text>
        </View>

        <View style={styles.quickAmounts}>
          {quickAmounts.map((value) => (
            <TouchableOpacity
              key={value}
              style={styles.quickAmountButton}
              onPress={() => handleQuickAmount(value)}
            >
              <Text style={styles.quickAmountText}>{value}€</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.methodsSection}>
        <Text style={styles.sectionTitle}>Méthode de paiement</Text>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={styles.methodItem}
            onPress={() => handleMethodSelect(method)}
          >
            <View style={styles.methodLeft}>
              <Ionicons name={method.icon} size={24} color="#007AFF" />
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={showCardModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Paiement par carte</Text>
              <TouchableOpacity onPress={() => setShowCardModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.cardInput}
              placeholder="Numéro de carte"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              maxLength={19}
            />

            <View style={styles.cardRow}>
              <TextInput
                style={[styles.cardInput, styles.halfInput]}
                placeholder="MM/YY"
                keyboardType="numeric"
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                maxLength={5}
              />
              <TextInput
                style={[styles.cardInput, styles.halfInput]}
                placeholder="CVV"
                keyboardType="numeric"
                value={cvv}
                onChangeText={setCvv}
                maxLength={3}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.payButton}
              onPress={handleCardPayment}
            >
              <Text style={styles.payButtonText}>
                Payer {amount ? amount + '€' : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  amountSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 20,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  amountInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 24,
  },
  currencyText: {
    fontSize: 24,
    marginLeft: 10,
    color: '#666',
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    width: '30%',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  quickAmountText: {
    color: '#666',
    fontWeight: '600',
  },
  methodsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodInfo: {
    marginLeft: 15,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  methodDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  cardInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  payButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RechargeScreen;
