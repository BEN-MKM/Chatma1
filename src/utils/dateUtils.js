import {
  format,
  formatDistanceToNow,
  formatDistanceToNowStrict,
  isToday,
  isYesterday,
  isThisWeek,
  isThisYear,
  parseISO,
} from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate une date pour l'affichage dans une conversation
 * @param {string|Date} date - Date à formater
 * @returns {string} Date formatée
 */
export const formatMessageDate = (date) => {
  const messageDate = date instanceof Date ? date : parseISO(date);
  
  if (isToday(messageDate)) {
    return format(messageDate, 'HH:mm');
  }
  
  if (isYesterday(messageDate)) {
    return 'Hier ' + format(messageDate, 'HH:mm');
  }
  
  if (isThisWeek(messageDate)) {
    return format(messageDate, 'EEEE HH:mm', { locale: fr });
  }
  
  if (isThisYear(messageDate)) {
    return format(messageDate, 'd MMM HH:mm', { locale: fr });
  }
  
  return format(messageDate, 'd MMM yyyy', { locale: fr });
};

/**
 * Formate une date pour l'affichage dans la liste des conversations
 * @param {string|Date} date - Date à formater
 * @returns {string} Date formatée
 */
export const formatConversationDate = (date) => {
  const messageDate = date instanceof Date ? date : parseISO(date);
  
  if (isToday(messageDate)) {
    return format(messageDate, 'HH:mm');
  }
  
  if (isYesterday(messageDate)) {
    return 'Hier';
  }
  
  if (isThisWeek(messageDate)) {
    return format(messageDate, 'EEEE', { locale: fr });
  }
  
  if (isThisYear(messageDate)) {
    return format(messageDate, 'd MMM', { locale: fr });
  }
  
  return format(messageDate, 'd MMM yyyy', { locale: fr });
};

/**
 * Formate une durée relative pour l'affichage "il y a..."
 * @param {string|Date} date - Date à formater
 * @param {boolean} [strict=false] - Si true, utilise le format strict (1h, 2j, etc.)
 * @returns {string} Durée formatée
 */
export const formatRelativeTime = (date, strict = false) => {
  const messageDate = date instanceof Date ? date : parseISO(date);
  
  if (strict) {
    return formatDistanceToNowStrict(messageDate, {
      locale: fr,
      addSuffix: true,
    });
  }
  
  return formatDistanceToNow(messageDate, {
    locale: fr,
    addSuffix: true,
  });
};

/**
 * Formate une durée en format lisible
 * @param {number} durationInSeconds - Durée en secondes
 * @returns {string} Durée formatée
 */
export const formatDuration = (durationInSeconds) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `0:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Groupe les messages par date
 * @param {Array} messages - Liste des messages
 * @returns {Array} Messages groupés par date
 */
export const groupMessagesByDate = (messages) => {
  const groups = messages.reduce((acc, message) => {
    const date = new Date(message.created_at);
    const dateKey = format(date, 'yyyy-MM-dd');
    
    if (!acc[dateKey]) {
      acc[dateKey] = {
        title: formatMessageGroupDate(date),
        data: [],
      };
    }
    
    acc[dateKey].data.push(message);
    return acc;
  }, {});
  
  return Object.values(groups);
};

/**
 * Formate une date pour l'en-tête d'un groupe de messages
 * @param {Date} date - Date à formater
 * @returns {string} Date formatée
 */
const formatMessageGroupDate = (date) => {
  if (isToday(date)) {
    return 'Aujourd\'hui';
  }
  
  if (isYesterday(date)) {
    return 'Hier';
  }
  
  if (isThisWeek(date)) {
    return format(date, 'EEEE', { locale: fr });
  }
  
  if (isThisYear(date)) {
    return format(date, 'd MMMM', { locale: fr });
  }
  
  return format(date, 'd MMMM yyyy', { locale: fr });
};

/**
 * Formate une date pour l'affichage du statut en ligne
 * @param {string|Date} date - Date de dernière connexion
 * @returns {string} Statut formaté
 */
export const formatLastSeen = (date) => {
  const lastSeen = date instanceof Date ? date : parseISO(date);
  const now = new Date();
  const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'En ligne';
  }
  
  if (diffInMinutes < 60) {
    return `Vu il y a ${diffInMinutes} min`;
  }
  
  return `Vu ${formatRelativeTime(lastSeen)}`;
};

export default {
  formatMessageDate,
  formatConversationDate,
  formatRelativeTime,
  formatDuration,
  groupMessagesByDate,
  formatLastSeen,
};
