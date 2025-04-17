import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const MarketReviewsScreen = ({ navigation, route }) => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Données de test
  const [reviews] = useState([
    {
      id: '1',
      productId: 'PROD123',
      productName: 'Smartphone XYZ',
      productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      customerName: 'Sophie Martin',
      rating: 5,
      comment: 'Excellent produit, livraison rapide et service client au top !',
      date: '2025-02-24',
      helpful: 12,
      reply: null,
      verified: true,
    },
    {
      id: '2',
      productId: 'PROD456',
      productName: 'Casque Audio Pro',
      productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      customerName: 'Pierre Dubois',
      rating: 4,
      comment: 'Très bon produit, mais l\'emballage pourrait être amélioré.',
      date: '2025-02-23',
      helpful: 5,
      reply: {
        text: 'Merci pour votre retour. Nous allons améliorer notre emballage.',
        date: '2025-02-23',
      },
      verified: true,
    },
  ]);

  const tabs = [
    { id: 'all', label: 'Tout' },
    { id: 'unanswered', label: 'Sans réponse' },
    { id: 'answered', label: 'Répondus' },
    { id: 'positive', label: '4-5 ★' },
    { id: 'negative', label: '1-3 ★' },
  ];

  const handleReply = (review) => {
    setSelectedReview(review);
    setReplyText(review.reply?.text || '');
    setShowReplyModal(true);
  };

  const submitReply = () => {
    if (!replyText.trim()) return;

    // Ici, vous implementeriez la logique pour sauvegarder la réponse
    console.log('Réponse envoyée:', {
      reviewId: selectedReview.id,
      reply: replyText,
    });

    setShowReplyModal(false);
    setReplyText('');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color={index < rating ? '#FFC107' : '#ddd'}
      />
    ));
  };

  const filteredReviews = reviews.filter(review => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'unanswered') return !review.reply;
    if (selectedTab === 'answered') return !!review.reply;
    if (selectedTab === 'positive') return review.rating >= 4;
    if (selectedTab === 'negative') return review.rating < 4;
    return true;
  });

  const renderReview = ({ item: review }) => (
    <View style={styles.reviewCard}>
      <TouchableOpacity
        style={styles.productInfo}
        onPress={() => navigation.navigate('ProductDetails', { productId: review.productId })}
      >
        <Image
          source={{ uri: review.productImage }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <Text style={styles.productName} numberOfLines={1}>
          {review.productName}
        </Text>
      </TouchableOpacity>

      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{review.customerName}</Text>
          {review.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#4CAF50" />
              <Text style={styles.verifiedText}>Achat vérifié</Text>
            </View>
          )}
        </View>
        <Text style={styles.reviewDate}>{new Date(review.date).toLocaleDateString()}</Text>
      </View>

      <View style={styles.ratingContainer}>
        <View style={styles.stars}>
          {renderStars(review.rating)}
        </View>
        <View style={styles.helpfulContainer}>
          <Ionicons name="thumbs-up-outline" size={14} color="#666" />
          <Text style={styles.helpfulText}>{review.helpful}</Text>
        </View>
      </View>

      <Text style={styles.reviewComment}>{review.comment}</Text>

      {review.reply && (
        <View style={styles.replyContainer}>
          <View style={styles.replyHeader}>
            <Ionicons name="return-up-back" size={16} color="#666" />
            <Text style={styles.replyTitle}>Votre réponse</Text>
            <Text style={styles.replyDate}>
              {new Date(review.reply.date).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.replyText}>{review.reply.text}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.replyButton}
        onPress={() => handleReply(review)}
      >
        <Ionicons name="chatbubble-outline" size={20} color="#4CAF50" />
        <Text style={styles.replyButtonText}>
          {review.reply ? 'Modifier la réponse' : 'Répondre'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderReplyModal = () => (
    <Modal
      visible={showReplyModal}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedReview?.reply ? 'Modifier la réponse' : 'Répondre à l\'avis'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowReplyModal(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalReview}>
            <View style={styles.stars}>
              {selectedReview && renderStars(selectedReview.rating)}
            </View>
            <Text style={styles.modalReviewText}>
              {selectedReview?.comment}
            </Text>
          </View>

          <TextInput
            style={styles.replyInput}
            placeholder="Votre réponse..."
            value={replyText}
            onChangeText={setReplyText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={submitReply}
          >
            <Text style={styles.submitButtonText}>Envoyer la réponse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Avis clients</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>4.8</Text>
          <View style={styles.stars}>
            {renderStars(5)}
          </View>
          <Text style={styles.statLabel}>Note moyenne</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>95%</Text>
          <Text style={styles.statLabel}>Avis positifs</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>152</Text>
          <Text style={styles.statLabel}>Total des avis</Text>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedTab === tab.id && styles.activeTab,
            ]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab.id && styles.activeTabText,
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredReviews}
        renderItem={renderReview}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.reviewsList}
      />

      {renderReplyModal()}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#eee',
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  reviewsList: {
    padding: 16,
    gap: 16,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  helpfulContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  helpfulText: {
    fontSize: 12,
    color: '#666',
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  replyContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  replyTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  replyDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 'auto',
  },
  replyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  replyButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
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
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  modalReview: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  modalReviewText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  replyInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    height: 120,
    marginBottom: 16,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MarketReviewsScreen;
