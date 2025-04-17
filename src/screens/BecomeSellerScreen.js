import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ImagePlaceholder from '../components/ImagePlaceholder';
import { useSeller } from '../contexts/SellerContext';

const BecomeSellerScreen = ({ navigation }) => {
  const { becomeSeller, loading, error, seller } = useSeller();
  const [formData, setFormData] = useState({
    shopName: '',
    description: '',
    address: '',
    phone: '',
    email: '',
  });
  const [documents, setDocuments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const pickDocument = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à vos photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setDocuments([...documents, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection du document:', error);
      Alert.alert('Erreur', 'Impossible de charger le document. Veuillez réessayer.');
    }
  };

  const handleSubmit = async () => {
    try {
      // Vérification des champs requis
      if (!formData.shopName || !formData.description || !formData.address || !formData.phone || !formData.email) {
        Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires.');
        return;
      }

      if (documents.length === 0) {
        Alert.alert('Documents requis', 'Veuillez ajouter au moins un document justificatif.');
        return;
      }

      setSubmitting(true);

      // Récupérer l'ID de l'utilisateur connecté
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        Alert.alert('Erreur', 'Vous devez être connecté pour devenir vendeur.');
        return;
      }

      // Préparer les données du vendeur
      const sellerData = {
        userId: session.user.id,
        shopName: formData.shopName,
        description: formData.description,
        contactEmail: formData.email,
        phoneNumber: formData.phone,
        address: formData.address,
        documents: documents,
        status: 'pending'
      };

      // Soumettre la demande
      const result = await becomeSeller(sellerData);

      if (result.success) {
        Alert.alert(
          'Demande envoyée',
          'Votre demande a été envoyée avec succès. Nous l\'examinerons dans les plus brefs délais.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Erreur', result.error || 'Une erreur est survenue lors de l\'envoi de votre demande');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi de votre demande');
    } finally {
      setSubmitting(false);
    }
  };

  if (seller?.status === 'approved') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Statut Vendeur</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.verifiedContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          <Text style={styles.verifiedTitle}>Vendeur Vérifié</Text>
          <Text style={styles.verifiedText}>
            Votre compte est vérifié. Vous pouvez maintenant ajouter des produits à votre boutique.
          </Text>
          <TouchableOpacity
            style={styles.addProductButton}
            onPress={() => navigation.navigate('AddProduct')}
          >
            <Text style={styles.addProductButtonText}>Ajouter un produit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (sellerStatus.verificationStatus === 'pending') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Statut Vendeur</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.pendingContainer}>
          <Ionicons name="time" size={80} color="#FFC107" />
          <Text style={styles.pendingTitle}>Demande en cours</Text>
          <Text style={styles.pendingText}>
            Votre demande est en cours d'examen. Nous vous notifierons dès qu'elle sera traitée.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Devenir Vendeur</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de la boutique</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom de la boutique"
            value={formData.shopName}
            onChangeText={(text) => setFormData({...formData, shopName: text})}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description de la boutique"
            value={formData.description}
            onChangeText={(text) => setFormData({...formData, description: text})}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coordonnées</Text>
          <TextInput
            style={styles.input}
            placeholder="Adresse"
            value={formData.address}
            onChangeText={(text) => setFormData({...formData, address: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            value={formData.phone}
            onChangeText={(text) => setFormData({...formData, phone: text})}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents justificatifs</Text>
          <Text style={styles.helperText}>
            Veuillez fournir une pièce d'identité et un justificatif d'activité commerciale.
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.documentsContainer}
          >
            {documents.map((uri, index) => (
              <View key={index} style={styles.documentWrapper}>
                <ImagePlaceholder size={100} imageUri={uri} />
                <TouchableOpacity 
                  style={styles.removeDocumentButton}
                  onPress={() => setDocuments(documents.filter((_, i) => i !== index))}
                >
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity 
              style={styles.addDocumentButton}
              onPress={pickDocument}
            >
              <Ionicons name="add" size={40} color="#4CAF50" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Envoyer la demande</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  documentsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  documentWrapper: {
    marginRight: 10,
    position: 'relative',
  },
  removeDocumentButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addDocumentButton: {
    width: 100,
    height: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  verifiedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  verifiedTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  verifiedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  addProductButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  addProductButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pendingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pendingTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  pendingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default BecomeSellerScreen;
