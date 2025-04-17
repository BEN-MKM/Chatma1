import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';

const MarketChatScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [negotiationPrice, setNegotiationPrice] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [quickReplies, setQuickReplies] = useState([
    "Est-ce que c'est toujours disponible ?",
    "Pouvez-vous faire un meilleur prix ?",
    "Quelle est la dernière réduction possible ?",
    "Pouvez-vous me donner plus de détails ?",
    "Est-ce que la livraison est incluse ?"
  ]);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Charger les informations du produit depuis les paramètres de route
    const { productId, sellerId, productName, productImage, productPrice, sellerName } = route.params;
    
    setProductInfo({
      id: productId,
      name: productName || 'Produit',
      price: productPrice ? `${productPrice}€` : 'Prix non disponible',
      image: productImage || 'https://via.placeholder.com/100',
      seller: {
        id: sellerId,
        name: sellerName || 'Vendeur',
        avatar: `https://randomuser.me/api/portraits/${Math.floor(Math.random() * 70)}.jpg`
      }
    });

    // Charger l'historique des messages
    const mockMessages = [
      {
        id: '1',
        content: `Bonjour, je suis intéressé par votre produit "${productName}"`,
        sender: { id: 'currentUser', name: 'Moi' },
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        type: 'text'
      },
      {
        id: '2',
        content: 'Bonjour ! Bien sûr, que souhaitez-vous savoir ?',
        sender: { id: sellerId, name: sellerName },
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
        type: 'text'
      }
    ];

    setMessages(mockMessages);
    setLoading(false);
  }, [route.params]);

  const sendMessage = useCallback(() => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content: inputText.trim(),
      sender: { id: 'currentUser', name: 'Moi' },
      timestamp: new Date(),
      type: 'text',
      isMarketMessage: true
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [inputText]);

  const NegotiationSystem = ({ originalPrice, onSubmit }) => {
    const [offer, setOffer] = useState('');
    const maxDiscount = originalPrice * 0.3; // 30% de réduction maximum

    return (
      <View style={styles.negotiationContainer}>
        <Text style={styles.negotiationTitle}>Faire une offre</Text>
        <View style={styles.negotiationInput}>
          <TextInput
            style={styles.priceInput}
            value={offer}
            onChangeText={setOffer}
            keyboardType="numeric"
            placeholder="Votre offre"
          />
          <TouchableOpacity
            style={[
              styles.submitOffer,
              !offer || parseFloat(offer) < (originalPrice - maxDiscount) && styles.submitOfferDisabled
            ]}
            onPress={() => {
              if (offer && parseFloat(offer) >= (originalPrice - maxDiscount)) {
                onSubmit(parseFloat(offer));
              }
            }}
          >
            <Text style={styles.submitOfferText}>Envoyer l'offre</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.negotiationHint}>
          Offre minimum possible: {(originalPrice - maxDiscount).toFixed(2)}€
        </Text>
      </View>
    );
  };

  const QuickReplies = ({ replies, onSelect }) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.quickRepliesContainer}
    >
      {replies.map((reply, index) => (
        <TouchableOpacity
          key={index}
          style={styles.quickReply}
          onPress={() => onSelect(reply)}
        >
          <Text style={styles.quickReplyText}>{reply}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const OrderStatus = ({ status }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'pending': return '#FFA500';
        case 'accepted': return '#32CD32';
        case 'shipped': return '#1E90FF';
        case 'delivered': return '#008000';
        case 'cancelled': return '#FF0000';
        default: return '#666';
      }
    };

    const getStatusText = () => {
      switch (status) {
        case 'pending': return 'En attente';
        case 'accepted': return 'Commande acceptée';
        case 'shipped': return 'En cours de livraison';
        case 'delivered': return 'Livré';
        case 'cancelled': return 'Annulé';
        default: return 'Statut inconnu';
      }
    };

    return (
      <View style={[styles.orderStatus, { borderColor: getStatusColor() }]}>
        <Ionicons name="time" size={20} color={getStatusColor()} />
        <Text style={[styles.orderStatusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </View>
    );
  };

  const shareProduct = async (product) => {
    try {
      const result = await Sharing.share({
        message: `Découvrez ${product.name} à ${product.price}€ sur ChatMa Market!`,
        url: `chatma://product/${product.id}`,
      });
      if (result.action === Sharing.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      }
    } catch (error) {
      Alert.alert('Erreur', 'Le partage a échoué');
    }
  };

  const renderProductHeader = () => (
    <TouchableOpacity 
      style={styles.productHeader}
      onPress={() => navigation.navigate('ProductDetail', { productId: productInfo.id })}
    >
      <Image source={{ uri: productInfo?.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{productInfo?.name}</Text>
        <Text style={styles.productPrice}>{productInfo?.price}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender.id === 'currentUser' ? styles.sentMessage : styles.receivedMessage
    ]}>
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{productInfo?.seller?.name || 'Chat'}</Text>
        <TouchableOpacity onPress={() => shareProduct(productInfo)}>
          <Ionicons name="share-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {productInfo && renderProductHeader()}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Message à propos du produit..."
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={inputText.trim() ? "#007AFF" : "#999"} 
          />
        </TouchableOpacity>
      </View>

      {negotiationPrice && (
        <NegotiationSystem 
          originalPrice={productInfo.price.replace('€', '')} 
          onSubmit={(price) => setNegotiationPrice(price)} 
        />
      )}

      {orderStatus && (
        <OrderStatus status={orderStatus} />
      )}

      <QuickReplies 
        replies={quickReplies} 
        onSelect={(reply) => setInputText(reply)} 
      />

      <TouchableOpacity 
        style={styles.shareButton} 
        onPress={() => shareProduct(productInfo)}
      >
        <Ionicons name="share" size={24} color="#007AFF" />
      </TouchableOpacity>
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f8f8',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
  },
  messagesList: {
    padding: 15,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9E9EB',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
  negotiationContainer: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    margin: 10,
  },
  negotiationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  negotiationInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  submitOffer: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  submitOfferDisabled: {
    backgroundColor: '#ccc',
  },
  quickRepliesContainer: {
    height: 50,
    marginVertical: 10,
  },
  quickReply: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
  },
  shareButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    margin: 10,
  }
});

export default MarketChatScreen;
