const translations = {
  fr: {
    welcome: 'Bienvenue',
    search: 'Rechercher',
    settings: 'Paramètres',
    profile: 'Profil',
    messages: 'Messages',
    chat: 'Discussion',
    market: 'Marché',
    feed: 'Fil d\'actualité',
    camera: 'Caméra',
    gallery: 'Galerie',
    send: 'Envoyer',
    cancel: 'Annuler',
    save: 'Enregistrer'
  },
  en: {
    welcome: 'Welcome',
    search: 'Search',
    settings: 'Settings',
    profile: 'Profile',
    messages: 'Messages',
    chat: 'Chat',
    market: 'Market',
    feed: 'Feed',
    camera: 'Camera',
    gallery: 'Gallery',
    send: 'Send',
    cancel: 'Cancel',
    save: 'Save'
  }
};

const currentLocale = 'fr';

export const t = (key) => {
  return translations[currentLocale][key] || key;
};

