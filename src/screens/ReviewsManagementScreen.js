import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReviewsManagementScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');

  const [reviews] = useState([
    {
      id: '1',
      customer: 'Sophie Martin',
      rating: 4.5,
      comment: 'Excellent service, livraison rapide !',
      date: '2025-02-14',
      product: 'Smartphone 5G',
      status: 'pending',
      reply: '',
    },
    {
      id: '2',
      customer: 'Pierre Dubois',
      rating: 3.0,
      comment: 'Produit correct mais délai de livraison long',
      date: '2025-02-13',
      product: 'Tablette Pro',
      status: 'replied',
      reply: 'Merci pour votre retour. Nous travaillons à améliorer nos délais.',
    },
  ]);

  const handleReply = () => {
    // Logique pour enregistrer la réponse
    setShowReplyModal(false);
    setReplyText('');
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedFilter === 'all' && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedFilter('all')}
      >
        <Text style={styles.filterText}>Tous</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedFilter === 'pending' && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedFilter('pending')}
      >
        <Text style={styles.filterText}>En attente</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedFilter === 'replied' && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedFilter('replied')}
      >
        <Text style={styles.filterText}>Répondus</Text>
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
            <Text style={styles.modalTitle}>Répondre à l'avis</Text>
            <TouchableOpacity onPress={() => setShowReplyModal(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={styles.reviewDetails}>
            <Text style={styles.customerName}>{selectedReview?.customer}</Text>
            {renderStars(selectedReview?.rating)}
            <Text style={styles.reviewComment}>{selectedReview?.comment}</Text>
          </View>
          <TextInput
            style={styles.replyInput}
            placeholder="Votre réponse..."
            multiline
            value={replyText}
            onChangeText={setReplyText}
          />
          <TouchableOpacity
            style={styles.replyButton}
            onPress={handleReply}
          >
            <Text style={styles.replyButtonText}>Envoyer la réponse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderReviewItem = (review) => (
    <View key={review.id} style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View>
          <Text style={styles.customerName}>{review.customer}</Text>
          <Text style={styles.reviewDate}>{review.date}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          review.status === 'replied' ? styles.repliedBadge : styles.pendingBadge
        ]}>
          <Text style={styles.statusText}>
            {review.status === 'replied' ? 'Répondu' : 'En attente'}
          </Text>
        </View>
      </View>
      <Text style={styles.productName}>{review.product}</Text>
      {renderStars(review.rating)}
      <Text style={styles.reviewComment}>{review.comment}</Text>
      {review.reply && (
        <View style={styles.replyContainer}>
          <Ionicons name="return-down-forward" size={20} color="#666" />
          <Text style={styles.replyText}>{review.reply}</Text>
        </View>
      )}
      {!review.reply && (
        <TouchableOpacity
          style={styles.replyActionButton}
          onPress={() => {
            setSelectedReview(review);
            setShowReplyModal(true);
          }}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#FF4D4F" />
          <Text style={styles.replyActionText}>Répondre</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des Avis</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.5</Text>
            <Text style={styles.statLabel}>Note moyenne</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Taux de réponse</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24h</Text>
            <Text style={styles.statLabel}>Délai moyen</Text>
          </View>
        </View>
      </View>
      {renderFilters()}
      <ScrollView style={styles.reviewsList}>
        {reviews
          .filter(review => 
            selectedFilter === 'all' || review.status === selectedFilter
          )
          .map(review => renderReviewItem(review))
        }
      </ScrollView>
      {renderReplyModal()}
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4D4F',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#FF4D4F',
  },
  filterText: {
    color: '#666',
  },
  reviewsList: {
    padding: 15,
  },
  reviewItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  repliedBadge: {
    backgroundColor: '#4CAF50',
  },
  pendingBadge: {
    backgroundColor: '#FFC107',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
  },
  productName: {
    color: '#666',
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  reviewComment: {
    marginVertical: 10,
  },
  replyContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  replyText: {
    marginLeft: 10,
    flex: 1,
    color: '#666',
  },
  replyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  replyActionText: {
    color: '#FF4D4F',
    marginLeft: 5,
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
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reviewDetails: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  replyInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    marginBottom: 20,
  },
  replyButton: {
    backgroundColor: '#FF4D4F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  replyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
