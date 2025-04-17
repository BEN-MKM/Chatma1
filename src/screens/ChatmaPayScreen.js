import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const ChatMaPayScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('send');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(1000.00);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView>
        {/* En-tête avec solde */}
        <View style={styles.header}>
          <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>Solde disponible</Text>
          <Text style={[styles.balance, { color: theme.text }]}>{balance.toFixed(2)} €</Text>
        </View>

        {/* Onglets */}
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'send' && styles.activeTab]}
            onPress={() => setActiveTab('send')}
          >
            <Text style={[styles.tabText, { color: theme.text }]}>Envoyer</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'receive' && styles.activeTab]}
            onPress={() => setActiveTab('receive')}
          >
            <Text style={[styles.tabText, { color: theme.text }]}>Recevoir</Text>
          </TouchableOpacity>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
            placeholder="Montant"
            placeholderTextColor={theme.textSecondary}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={() => Alert.alert('Info', 'Cette fonctionnalité sera bientôt disponible!')}
          >
            <Text style={styles.buttonText}>{activeTab === 'send' ? 'Envoyer' : 'Recevoir'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    padding: 20,
    alignItems: 'center'
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold'
  },
  tabs: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'center',
    gap: 20
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20
  },
  activeTab: {
    backgroundColor: '#f0f0f0'
  },
  tabText: {
    fontSize: 16
  },
  form: {
    padding: 20,
    gap: 20
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16
  },
  button: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default ChatMaPayScreen;
