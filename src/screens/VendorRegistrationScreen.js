import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VendorRegistrationScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    
    // Informations professionnelles
    companyName: '',
    siret: '',
    tva: '',
    businessAddress: '',
    businessPhone: '',
    
    // Informations boutique
    shopName: '',
    shopDescription: '',
    shopCategory: '',
    deliveryOptions: [],
    
    // Documents
    idCard: null,
    proofOfAddress: null,
    bankDetails: null,
    
    // Paramètres de paiement
    bankName: '',
    iban: '',
    bic: '',
  });

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Informations Personnelles</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={formData.firstName}
        onChangeText={(text) => setFormData({...formData, firstName: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={formData.lastName}
        onChangeText={(text) => setFormData({...formData, lastName: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => setFormData({...formData, email: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(text) => setFormData({...formData, phone: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Date de naissance"
        value={formData.dateOfBirth}
        onChangeText={(text) => setFormData({...formData, dateOfBirth: text})}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Informations Professionnelles</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nom de l'entreprise"
        value={formData.companyName}
        onChangeText={(text) => setFormData({...formData, companyName: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Numéro SIRET"
        keyboardType="numeric"
        value={formData.siret}
        onChangeText={(text) => setFormData({...formData, siret: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Numéro de TVA"
        value={formData.tva}
        onChangeText={(text) => setFormData({...formData, tva: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Adresse professionnelle"
        multiline
        value={formData.businessAddress}
        onChangeText={(text) => setFormData({...formData, businessAddress: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Téléphone professionnel"
        keyboardType="phone-pad"
        value={formData.businessPhone}
        onChangeText={(text) => setFormData({...formData, businessPhone: text})}
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Configuration de la Boutique</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nom de la boutique"
        value={formData.shopName}
        onChangeText={(text) => setFormData({...formData, shopName: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Description de la boutique"
        multiline
        numberOfLines={4}
        value={formData.shopDescription}
        onChangeText={(text) => setFormData({...formData, shopDescription: text})}
      />
      
      <Text style={styles.labelText}>Catégorie principale :</Text>
      <View style={styles.categoryButtons}>
        {['Mode', 'Électronique', 'Maison', 'Sport', 'Autre'].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              formData.shopCategory === category && styles.categoryButtonSelected
            ]}
            onPress={() => setFormData({...formData, shopCategory: category})}
          >
            <Text style={[
              styles.categoryButtonText,
              formData.shopCategory === category && styles.categoryButtonTextSelected
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Documents Requis</Text>
      
      <TouchableOpacity 
        style={styles.documentUpload}
        onPress={() => Alert.alert('Upload', 'Télécharger pièce d\'identité')}
      >
        <Ionicons name="id-card-outline" size={24} color="#007AFF" />
        <Text style={styles.documentText}>
          Pièce d'identité
          {formData.idCard ? ' (Téléchargé)' : ''}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.documentUpload}
        onPress={() => Alert.alert('Upload', 'Télécharger justificatif de domicile')}
      >
        <Ionicons name="home-outline" size={24} color="#007AFF" />
        <Text style={styles.documentText}>
          Justificatif de domicile
          {formData.proofOfAddress ? ' (Téléchargé)' : ''}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.documentUpload}
        onPress={() => Alert.alert('Upload', 'Télécharger RIB')}
      >
        <Ionicons name="card-outline" size={24} color="#007AFF" />
        <Text style={styles.documentText}>
          RIB
          {formData.bankDetails ? ' (Téléchargé)' : ''}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const handleSubmit = () => {
    Alert.alert(
      'Confirmation',
      'Votre demande d\'inscription a été envoyée avec succès ! Nous l\'examinerons dans les plus brefs délais.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inscription Vendeur</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.progressBar}>
        {[1, 2, 3, 4].map((stepNumber) => (
          <View key={stepNumber} style={styles.progressStep}>
            <View style={[
              styles.progressDot,
              step >= stepNumber && styles.progressDotActive
            ]} />
            <View style={[
              styles.progressLine,
              stepNumber < 4 && styles.progressLineVisible,
              step > stepNumber && styles.progressLineActive
            ]} />
          </View>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </ScrollView>

      <View style={styles.footer}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => setStep(step - 1)}
          >
            <Text style={styles.footerButtonText}>Précédent</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.footerButton, styles.footerButtonPrimary]}
          onPress={() => {
            if (step < 4) {
              setStep(step + 1);
            } else {
              handleSubmit();
            }
          }}
        >
          <Text style={[styles.footerButtonText, styles.footerButtonTextPrimary]}>
            {step < 4 ? 'Suivant' : 'Soumettre'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  progressBar: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  progressDotActive: {
    backgroundColor: '#007AFF',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#eee',
    marginHorizontal: 4,
  },
  progressLineVisible: {
    backgroundColor: '#eee',
  },
  progressLineActive: {
    backgroundColor: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  labelText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonSelected: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    color: '#666',
  },
  categoryButtonTextSelected: {
    color: '#fff',
  },
  documentUpload: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  documentText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
  },
  footerButtonPrimary: {
    backgroundColor: '#007AFF',
  },
  footerButtonText: {
    fontSize: 16,
    color: '#666',
  },
  footerButtonTextPrimary: {
    color: '#fff',
  },
});

export default VendorRegistrationScreen;
