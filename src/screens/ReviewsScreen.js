import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReviewsScreen = ({ navigation }) => {
  const [reviews, setReviews] = useState([
    {
      id: '1',
      productId: '1',
      productName: 'iPhone 13 Pro',
      userName: 'Jean Dupont',
      rating: 5,
      comment: 'Excellent produit, livraison rapide !',
      date: '2025-02-20',
      liked: 12,
      replied: true,
      verified: true,
      images: ['https://example.com/review1.jpg'],
    },
    {
      id: '2',
      productId: '2',
      productName: 'MacBook Pro M1',
      userName: 'Marie Martin',
      rating: 4,
      comment: 'Très bon ordinateur, mais un peu cher.',
      date: '2025-02-19',
      liked: 8,
      replied: false,
      verified: true,
      images: [],
    },
  ]);

  const [filter, setFilter] = useState('all'); // all, positive, negative, unanswered
  const [sortBy, setSortBy] = useState('recent'); // recent, rating, likes

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color={star <= rating ? '#FFD700' : '#666'}
          />
        ))}
      </View>
    );
  };

  const renderReviewCard = (review) => (
    <View key={review.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.userInitial}>
              {review.userName.charAt(0)}
            </Text>
          </View>
          <View>
            <Text style={styles.userName}>{review.userName}</Text>
            <View style={styles.verifiedContainer}>
              {review.verified && (
                <>
                  <Ionicons name="checkmark-circle" size={14} color="#34C759" />
                  <Text style={styles.verifiedText}>Achat vérifié</Text>
                </>
              )}
            </View>
          </View>
        </View>
        <Text style={styles.reviewDate}>{review.date}</Text>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{review.productName}</Text>
        {renderStars(review.rating)}
      </View>

      <Text style={styles.reviewComment}>{review.comment}</Text>

      {review.images.length > 0 && (
        <ScrollView horizontal style={styles.imageGallery}>
          {review.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.reviewImage}
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.reviewActions}>
        <View style={styles.actionStats}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="thumbs-up-outline" size={20} color="#007AFF" />
            <Text style={styles.actionText}>{review.liked}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="flag-outline" size={20} color="#FF3B30" />
            <Text style={styles.actionText}>Signaler</Text>
          </TouchableOpacity>
        </View>

        {!review.replied && (
          <TouchableOpacity 
            style={styles.replyButton}
            onPress={() => Alert.alert('Répondre', `Répondre à l'avis de ${review.userName}`)}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#007AFF" />
            <Text style={styles.replyButtonText}>Répondre</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderFilters = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.filtersContainer}
    >
      <TouchableOpacity 
        style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
        onPress={() => setFilter('all')}
      >
        <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
          Tous
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.filterButton, filter === 'positive' && styles.filterButtonActive]}
        onPress={() => setFilter('positive')}
      >
        <Text style={[styles.filterText, filter === 'positive' && styles.filterTextActive]}>
          Positifs (4-5★)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.filterButton, filter === 'negative' && styles.filterButtonActive]}
        onPress={() => setFilter('negative')}
      >
        <Text style={[styles.filterText, filter === 'negative' && styles.filterTextActive]}>
          Négatifs (1-3★)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.filterButton, filter === 'unanswered' && styles.filterButtonActive]}
        onPress={() => setFilter('unanswered')}
      >
        <Text style={[styles.filterText, filter === 'unanswered' && styles.filterTextActive]}>
          Sans réponse
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>4.8</Text>
        <Text style={styles.statLabel}>Note moyenne</Text>
        {renderStars(5)}
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statNumber}>127</Text>
        <Text style={styles.statLabel}>Total avis</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statNumber}>98%</Text>
        <Text style={styles.statLabel}>Recommandations</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Avis Clients</Text>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {renderStats()}
      {renderFilters()}

      <ScrollView style={styles.content}>
        {reviews.map(renderReviewCard)}
      </ScrollView>
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
  filtersContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#34C759',
    marginLeft: 4,
  },
  reviewDate: {
    fontSize: 14,
    color: '#666',
  },
  productInfo: {
    marginBottom: 12,
  },
  productName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  imageGallery: {
    marginBottom: 12,
  },
  reviewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  replyButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#007AFF',
  },
});

export default ReviewsScreen;
