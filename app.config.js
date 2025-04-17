export default {
  expo: {
    name: 'ChatMa',
    slug: 'chatma',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.benmkm.chatma'
    },
    android: {
      package: 'com.benmkm.chatma',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      },
      permissions: [
        'CAMERA',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
        'RECORD_AUDIO',
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
        'READ_CONTACTS'
      ]
    },
    web: {
      favicon: './assets/favicon.png'
    },
    plugins: [
      [
        "expo-image-picker",
        {
          "photosPermission": "L'application nécessite l'accès à vos photos pour envoyer des images.",
          "cameraPermission": "L'application nécessite l'accès à votre caméra pour prendre des photos."
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "L'application nécessite l'accès à votre localisation pour partager votre position."
        }
      ],
      [
        "expo-contacts",
        {
          "contactsPermission": "L'application nécessite l'accès à vos contacts pour partager des contacts."
        }
      ],
      [
        "expo-av",
        {
          "microphonePermission": "L'application nécessite l'accès à votre microphone pour enregistrer des messages audio."
        }
      ],
      'expo-document-picker'
    ],
    extra: {
      supabaseUrl: 'VOTRE_URL_SUPABASE',
      supabaseAnonKey: 'VOTRE_CLE_ANONYME_SUPABASE'
    }
  }
};