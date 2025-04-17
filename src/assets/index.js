import { Asset } from 'expo-asset';

// Default avatar URL (using UI Avatars service)
const DEFAULT_AVATAR_URL = 'https://ui-avatars.com/api/?background=0D8ABC&color=fff';

// Logo placeholder (you can replace this with your actual logo later)
const LOGO_PLACEHOLDER = 'https://via.placeholder.com/200x50?text=ChatMa';

export const images = {
  defaultAvatar: DEFAULT_AVATAR_URL,
  logo: LOGO_PLACEHOLDER,
  // Les icônes seront gérées via @expo/vector-icons
  icons: {
    send: 'send',
    attachment: 'attach',
    camera: 'camera',
    microphone: 'mic',
    location: 'location',
    poll: 'stats-chart',
    translate: 'language',
    contact: 'person'
  }
};

// Images
export const defaultAvatar = DEFAULT_AVATAR_URL;
export const defaultGroupAvatar = 'https://ui-avatars.com/api/?name=Group&background=0D8ABC&color=fff';

// Sounds - Using empty functions as placeholders until actual sound files are added
export const ringtone = () => {};
export const messageTone = () => {};
export const callEndTone = () => {};
