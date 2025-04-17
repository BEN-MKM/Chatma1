import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomerServiceScreen = () => {
  const [selectedTab, setSelectedTab] = useState('tickets');
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [message, setMessage] = useState('');
  const chatScrollRef = useRef();

  const [tickets] = useState([
    {
      id: '1',
      customer: 'Sophie Martin',
      subject: 'Problème de livraison',
      status: 'pending',
      priority: 'high',
      createdAt: '2025-02-14 10:30',
      lastUpdate: '2025-02-14 11:45',
      messages: [
        {
          id: '1',
          sender: 'customer',
          content: 'Je n\'ai toujours pas reçu ma commande #CMD123',
          timestamp: '2025-02-14 10:30',
        },
        {
          id: '2',
          sender: 'agent',
          content: 'Je comprends votre inquiétude. Je vérifie cela immédiatement.',
          timestamp: '2025-02-14 11:45',
        },
      ],
    },
    {
      id: '2',
      customer: 'Pierre Dubois',
      subject: 'Demande de remboursement',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2025-02-13 15:20',
      lastUpdate: '2025-02-14 09:15',
      messages: [
        {
          id: '1',
          sender: 'customer',
          content: 'Le produit ne correspond pas à mes attentes',
          timestamp: '2025-02-13 15:20',
        },
        {
          id: '2',
          sender: 'agent',
          content: 'Je peux vous aider avec le processus de retour.',
          timestamp: '2025-02-13 15:35',
        },
      ],
    },
  ]);

  const [quickReplies] = useState([
    {
      id: '1',
      title: 'Accusé de réception',
      content: 'Bonjour, je prends en charge votre demande. Je reviens vers vous rapidement.',
    },
    {
      id: '2',
      title: 'Demande d\'informations',
      content: 'Pourriez-vous me fournir votre numéro de commande pour que je puisse vérifier ?',
    },
    {
      id: '3',
      title: 'Processus de retour',
      content: 'Pour effectuer un retour, suivez ces étapes : 1. Emballez l\'article 2. Imprimez l\'étiquette 3. Déposez le colis',
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'closed':
        return '#FF4D4F';
      default:
        return '#666';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#FF4D4F';
      case 'medium':
        return '#FFC107';
      case 'low':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  const renderTabs = () => (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'tickets' && styles.activeTab]}
        onPress={() => setSelectedTab('tickets')}
      >
        <Text style={[styles.tabText, selectedTab === 'tickets' && styles.activeTabText]}>
          Tickets
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'chat' && styles.activeTab]}
        onPress={() => setSelectedTab('chat')}
      >
        <Text style={[styles.tabText, selectedTab === 'chat' && styles.activeTabText]}>
          Chat en direct
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'faq' && styles.activeTab]}
        onPress={() => setSelectedTab('faq')}
      >
        <Text style={[styles.tabText, selectedTab === 'faq' && styles.activeTabText]}>
          FAQ
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTicketCard = (ticket) => (
    <TouchableOpacity
      style={styles.ticketCard}
      onPress={() => {
        setSelectedTicket(ticket);
        setShowChatModal(true);
      }}
    >
      <View style={styles.ticketHeader}>
        <View>
          <Text style={styles.customerName}>{ticket.customer}</Text>
          <Text style={styles.ticketSubject}>{ticket.subject}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(ticket.status) }
        ]}>
          <Text style={styles.statusText}>
            {ticket.status === 'resolved' ? 'Résolu' : 'En attente'}
          </Text>
        </View>
      </View>

      <View style={styles.ticketInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.infoText}>{ticket.createdAt}</Text>
        </View>
        <View style={[
          styles.priorityBadge,
          { backgroundColor: getPriorityColor(ticket.priority) }
        ]}>
          <Text style={styles.priorityText}>
            {ticket.priority === 'high' ? 'Urgent' : 'Normal'}
          </Text>
        </View>
      </View>

      <View style={styles.messagePreview}>
        <Text style={styles.previewText} numberOfLines={1}>
          {ticket.messages[ticket.messages.length - 1].content}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderChatModal = () => (
    <Modal
      visible={showChatModal}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{selectedTicket?.customer}</Text>
              <Text style={styles.modalSubtitle}>{selectedTicket?.subject}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowChatModal(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={chatScrollRef}
            style={styles.chatContainer}
            onContentSizeChange={() => chatScrollRef.current.scrollToEnd()}
          >
            {selectedTicket?.messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageContainer,
                  msg.sender === 'agent' ? styles.agentMessage : styles.customerMessage,
                ]}
              >
                <Text style={styles.messageText}>{msg.content}</Text>
                <Text style={styles.messageTime}>{msg.timestamp}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.quickRepliesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {quickReplies.map((reply) => (
                <TouchableOpacity
                  key={reply.id}
                  style={styles.quickReply}
                  onPress={() => setMessage(reply.content)}
                >
                  <Text style={styles.quickReplyText}>{reply.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Votre message..."
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => {
                // Logique d'envoi
                setMessage('');
              }}
            >
              <Ionicons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Service Client</Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>En attente</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5min</Text>
            <Text style={styles.statLabel}>Temps moyen</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>95%</Text>
            <Text style={styles.statLabel}>Satisfaction</Text>
          </View>
        </View>
      </View>

      {renderTabs()}

      {selectedTab === 'tickets' && (
        <ScrollView style={styles.ticketsList}>
          {tickets.map(ticket => renderTicketCard(ticket))}
        </ScrollView>
      )}

      {selectedTab === 'chat' && (
        <View style={styles.chatList}>
          <Text style={styles.comingSoon}>Chat en direct bientôt disponible</Text>
        </View>
      )}

      {selectedTab === 'faq' && (
        <View style={styles.faqList}>
          <Text style={styles.comingSoon}>FAQ bientôt disponible</Text>
        </View>
      )}

      {renderChatModal()}
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
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    color: '#666',
    marginTop: 5,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF4D4F',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#FF4D4F',
    fontWeight: 'bold',
  },
  ticketsList: {
    padding: 15,
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketSubject: {
    color: '#666',
    marginTop: 5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 5,
    color: '#666',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
  },
  messagePreview: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
  },
  previewText: {
    color: '#666',
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
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    color: '#666',
    marginTop: 5,
  },
  chatContainer: {
    flex: 1,
    padding: 15,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  customerMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  agentMessage: {
    backgroundColor: '#FF4D4F',
    alignSelf: 'flex-end',
  },
  messageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  quickRepliesContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  quickReply: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  quickReplyText: {
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#FF4D4F',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoon: {
    color: '#666',
    fontSize: 16,
  },
});

export default CustomerServiceScreen;
