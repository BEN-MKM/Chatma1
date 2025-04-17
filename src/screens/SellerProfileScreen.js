import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SellerProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profile, setProfile] = useState({
    storeName: 'Ma Super Boutique',
    description: 'Vente de produits électroniques et accessoires',
    email: 'contact@superboutique.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue du Commerce, 75001 Paris',
    logo: 'https://example.com/logo.png',
    banner: 'https://example.com/banner.jpg',
    categories: ['Électronique', 'Accessoires', 'Gadgets'],
    paymentMethods: ['Carte bancaire', 'PayPal', 'Apple Pay'],
    shippingMethods: ['Standard', 'Express', 'Point relais'],
    openingHours: {
      monday: '9:00 - 18:00',
      tuesday: '9:00 - 18:00',
      wednesday: '9:00 - 18:00',
      thursday: '9:00 - 18:00',
      friday: '9:00 - 18:00',
      saturday: '10:00 - 17:00',
      sunday: 'Fermé',
    },
  });

  const renderHeader = () => (
    <View style={styles.header}>
      <Image
        source={{ uri: profile.banner }}
        style={styles.bannerImage}
      />
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: profile.logo }}
          style={styles.logoImage}
        />
        <TouchableOpacity style={styles.editLogoButton}>
          <Ionicons name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setIsEditing(!isEditing)}
      >
        <Ionicons name={isEditing ? 'save' : 'create'} size={24} color="#FF4D4F" />
      </TouchableOpacity>
    </View>
  );

  const renderBasicInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Informations de base</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nom de la boutique</Text>
        <TextInput
          style={styles.input}
          value={profile.storeName}
          editable={isEditing}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={profile.description}
          multiline
          editable={isEditing}
        />
      </View>
    </View>
  );

  const renderContactInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contact</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={profile.email}
          editable={isEditing}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          value={profile.phone}
          editable={isEditing}
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Adresse</Text>
        <TextInput
          style={styles.input}
          value={profile.address}
          editable={isEditing}
        />
      </View>
    </View>
  );

  const renderBusinessHours = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Horaires d'ouverture</Text>
      {Object.entries(profile.openingHours).map(([day, hours]) => (
        <View key={day} style={styles.hourRow}>
          <Text style={styles.dayText}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
          <TextInput
            style={styles.hourInput}
            value={hours}
            editable={isEditing}
          />
        </View>
      ))}
    </View>
  );

  const renderPaymentMethods = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Moyens de paiement</Text>
      <View style={styles.chipContainer}>
        {profile.paymentMethods.map((method, index) => (
          <View key={index} style={styles.chip}>
            <Text style={styles.chipText}>{method}</Text>
            {isEditing && (
              <TouchableOpacity style={styles.removeChip}>
                <Ionicons name="close-circle" size={20} color="#FF4D4F" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        {isEditing && (
          <TouchableOpacity style={styles.addChip}>
            <Ionicons name="add" size={24} color="#FF4D4F" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Paramètres</Text>
      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#ddd', true: '#FF4D4F' }}
        />
      </View>
      <TouchableOpacity style={styles.settingRow}>
        <Text style={styles.settingText}>Confidentialité</Text>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingRow}>
        <Text style={styles.settingText}>Conditions de vente</Text>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}
      {renderBasicInfo()}
      {renderContactInfo()}
      {renderBusinessHours()}
      {renderPaymentMethods()}
      {renderSettings()}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    position: 'absolute',
    bottom: -40,
    left: 20,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editLogoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF4D4F',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayText: {
    width: 100,
  },
  hourInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  chipText: {
    marginRight: 5,
  },
  removeChip: {
    marginLeft: 5,
  },
  addChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 16,
  },
  logoutButton: {
    margin: 20,
    backgroundColor: '#FF4D4F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SellerProfileScreen;
