import { Platform } from 'react-native';
import { EventEmitter } from 'events';

class WebSocketService extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = null;
  }

  connect(userId) {
    const wsUrl = `wss://api.chatma.com/ws/${userId}`;
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket Connected');
      this.reconnectAttempts = 0;
      this.emit('connected');
      
      // Envoyer le statut en ligne
      this.sendPresence('online');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket Disconnected');
      this.emit('disconnected');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      this.emit('error', error);
    };
  }

  handleMessage(data) {
    switch (data.type) {
      case 'presence':
        this.emit('presenceUpdate', data);
        break;
      case 'reaction':
        this.emit('newReaction', data);
        break;
      case 'comment':
        this.emit('newComment', data);
        break;
      case 'message':
        this.emit('newMessage', data);
        break;
      case 'notification':
        this.emit('notification', data);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  sendPresence(status) {
    this.send({
      type: 'presence',
      status,
      timestamp: new Date().toISOString()
    });
  }

  sendReaction(postId, reaction) {
    this.send({
      type: 'reaction',
      postId,
      reaction,
      timestamp: new Date().toISOString()
    });
  }

  sendTypingStatus(chatId, isTyping) {
    this.send({
      type: 'typing',
      chatId,
      isTyping,
      timestamp: new Date().toISOString()
    });
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('reconnectFailed');
      return;
    }

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000));
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    if (this.ws) {
      this.sendPresence('offline');
      this.ws.close();
    }
  }
}

export default new WebSocketService();
