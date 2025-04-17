import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoyaltyProgramScreen = () => {
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  const [loyaltyData] = useState({
    currentPoints: 2500,
    currentTier: 'Gold',
    pointsToNextTier: 2500,
    nextTier: 'Platinum',
    pointsHistory: [
      {
        id: '1',
        date: '2025-02-14',
        points: 100,
        type: 'earned',
        description: 'Achat Smartphone 5G',
      },
      {
        id: '2',
        date: '2025-02-13',
        points: -500,
        type: 'spent',
        description: 'Échange contre bon d\'achat',
      },
    ],
    tiers: [
      {
        name: 'Bronze',
        pointsRequired: 0,
        benefits: [
          'Livraison standard gratuite',
          'Accès aux ventes flash',
          'Support client standard',
        ],
        icon: '🥉',
      },
      {
        name: 'Silver',
        pointsRequired: 1000,
        benefits: [
          'Livraison express à -50%',
          'Accès prioritaire aux ventes flash',
          'Support client prioritaire',
          'Remise de 5% sur les accessoires',
        ],
        icon: '🥈',
      },
      {
        name: 'Gold',
        pointsRequired: 2500,
        benefits: [
          'Livraison express gratuite',
          'Accès VIP aux ventes flash',
          'Support client VIP 24/7',
          'Remise de 10% sur les accessoires',
          'Garantie prolongée',
        ],
        icon: '🥇',
      },
      {
        name: 'Platinum',
        pointsRequired: 5000,
        benefits: [
          'Livraison express gratuite mondiale',
          'Accès exclusif aux préventes',
          'Concierge personnel',
          'Remise de 15% sur tout le catalogue',
          'Garantie prolongée premium',
          'Événements VIP exclusifs',
        ],
        icon: '💎',
      },
    ],
  });

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.currentTierInfo}>
        <Text style={styles.tierName}>{loyaltyData.currentTier}</Text>
        <Text style={styles.pointsText}>{loyaltyData.currentPoints} points</Text>
      </View>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {loyaltyData.pointsToNextTier} points pour atteindre {loyaltyData.nextTier}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progress,
              { width: `${(loyaltyData.currentPoints / (loyaltyData.currentPoints + loyaltyData.pointsToNextTier)) * 100}%` }
            ]}
          />
        </View>
      </View>
    </View>
  );

  const renderTierCard = (tier) => (
    <TouchableOpacity
      key={tier.name}
      style={[
        styles.tierCard,
        tier.name === loyaltyData.currentTier && styles.currentTierCard
      ]}
      onPress={() => {
        setSelectedTier(tier);
        setShowBenefitsModal(true);
      }}
    >
      <Text style={styles.tierIcon}>{tier.icon}</Text>
      <View style={styles.tierInfo}>
        <Text style={styles.tierCardName}>{tier.name}</Text>
        <Text style={styles.tierPoints}>
          {tier.pointsRequired} points requis
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );

  const renderBenefitsModal = () => (
    <Modal
      visible={showBenefitsModal}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedTier?.icon} Avantages {selectedTier?.name}
            </Text>
            <TouchableOpacity onPress={() => setShowBenefitsModal(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.benefitsList}>
            {selectedTier?.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </ScrollView>
          {selectedTier?.name !== loyaltyData.currentTier && (
            <View style={styles.upgradeInfo}>
              <Text style={styles.upgradeText}>
                {selectedTier?.pointsRequired - loyaltyData.currentPoints} points de plus pour atteindre ce niveau
              </Text>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Comment gagner plus de points</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  const renderPointsHistory = () => (
    <View style={styles.historyContainer}>
      <Text style={styles.sectionTitle}>Historique des points</Text>
      {loyaltyData.pointsHistory.map(item => (
        <View key={item.id} style={styles.historyItem}>
          <View style={styles.historyLeft}>
            <Text style={styles.historyDate}>{item.date}</Text>
            <Text style={styles.historyDescription}>{item.description}</Text>
          </View>
          <Text style={[
            styles.historyPoints,
            item.type === 'earned' ? styles.pointsEarned : styles.pointsSpent
          ]}>
            {item.type === 'earned' ? '+' : ''}{item.points}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}
      <View style={styles.tiersContainer}>
        <Text style={styles.sectionTitle}>Niveaux de fidélité</Text>
        {loyaltyData.tiers.map(tier => renderTierCard(tier))}
      </View>
      {renderPointsHistory()}
      {renderBenefitsModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currentTierInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  tierName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4D4F',
  },
  pointsText: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  progress: {
    height: '100%',
    backgroundColor: '#FF4D4F',
    borderRadius: 5,
  },
  tiersContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  currentTierCard: {
    borderWidth: 2,
    borderColor: '#FF4D4F',
  },
  tierIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  tierInfo: {
    flex: 1,
  },
  tierCardName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tierPoints: {
    color: '#666',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  benefitsList: {
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  benefitText: {
    marginLeft: 10,
    flex: 1,
  },
  upgradeInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  upgradeText: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
  },
  upgradeButton: {
    backgroundColor: '#FF4D4F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  historyContainer: {
    padding: 20,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  historyLeft: {
    flex: 1,
  },
  historyDate: {
    color: '#666',
    fontSize: 12,
  },
  historyDescription: {
    marginTop: 5,
  },
  historyPoints: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  pointsEarned: {
    color: '#4CAF50',
  },
  pointsSpent: {
    color: '#FF4D4F',
  },
});

export default LoyaltyProgramScreen;
