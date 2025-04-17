import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PromotionsScreen = ({ navigation }) => {
  const [promotions, setPromotions] = useState([
    {
      id: '1',
      title: 'Soldes d\'été',
      discount: '30',
      type: 'percentage',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      active: true,
      conditions: 'Minimum d\'achat 50€',
      categories: ['Mode', 'Sport'],
    },
    {
      id: '2',
      title: 'Black Friday',
      discount: '50',
      type: 'percentage',
      startDate: '2025-11-29',
      endDate: '2025-11-30',
      active: false,
      conditions: 'Tous les articles',
      categories: ['Électronique'],
    },
  ]);

  const [newPromotion, setNewPromotion] = useState({
    title: '',
    discount: '',
    type: 'percentage',
    startDate: '',
    endDate: '',
    active: true,
    conditions: '',
    categories: [],
  });

  const renderPromotionCard = (promotion) => (
    <View key={promotion.id} style={styles.promotionCard}>
      <View style={styles.promotionHeader}>
        <View>
          <Text style={styles.promotionTitle}>{promotion.title}</Text>
          <Text style={styles.promotionDates}>
            Du {promotion.startDate} au {promotion.endDate}
          </Text>
        </View>
        <Switch
          value={promotion.active}
          onValueChange={(value) => togglePromotion(promotion.id, value)}
        />
      </View>

      <View style={styles.promotionDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="pricetag-outline" size={20} color="#007AFF" />
          <Text style={styles.detailText}>
            {promotion.discount}% de réduction
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
          <Text style={styles.detailText}>{promotion.conditions}</Text>
        </View>

        <View style={styles.categoriesList}>
          {promotion.categories.map((category) => (
            <View key={category} style={styles.categoryTag}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.promotionActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => editPromotion(promotion.id)}
        >
          <Ionicons name="create-outline" size={20} color="#007AFF" />
          <Text style={styles.actionButtonText}>Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.actionButtonDanger]}
          onPress={() => deletePromotion(promotion.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>
            Supprimer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const togglePromotion = (id, value) => {
    setPromotions(promotions.map(promo => 
      promo.id === id ? {...promo, active: value} : promo
    ));
  };

  const editPromotion = (id) => {
    Alert.alert('Modification', 'Modifier la promotion ' + id);
  };

  const deletePromotion = (id) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer cette promotion ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setPromotions(promotions.filter(promo => promo.id !== id));
          },
        },
      ],
    );
  };

  const createPromotion = () => {
    Alert.alert('Création', 'Créer une nouvelle promotion');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Promotions</Text>
        <TouchableOpacity onPress={createPromotion}>
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {promotions.filter(p => p.active).length}
          </Text>
          <Text style={styles.statLabel}>Promos actives</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {promotions.length}
          </Text>
          <Text style={styles.statLabel}>Total promos</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {promotions.map(renderPromotionCard)}
      </ScrollView>

      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={createPromotion}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.floatingButtonText}>Nouvelle Promotion</Text>
      </TouchableOpacity>
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  promotionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  promotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  promotionDates: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  promotionDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  promotionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  actionButtonDanger: {
    backgroundColor: '#FFF2F2',
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#007AFF',
  },
  actionButtonTextDanger: {
    color: '#FF3B30',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PromotionsScreen;
