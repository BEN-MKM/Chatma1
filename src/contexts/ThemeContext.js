import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext({});

// Thème clair par défaut
const lightTheme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#000000',
    border: '#E5E5EA',
    notification: '#FF3B30',
    placeholder: '#8E8E93',
    backdrop: 'rgba(0,0,0,0.5)',
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    info: '#5856D6',
    messageBackground: {
      own: '#007AFF',
      other: '#FFFFFF',
    },
    messageText: {
      own: '#FFFFFF',
      other: '#000000',
    },
    timestamp: {
      own: 'rgba(255,255,255,0.7)',
      other: '#8E8E93',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  roundness: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
    },
    small: {
      fontSize: 12,
      fontWeight: 'normal',
    },
  },
};

// Thème sombre
const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    border: '#38383A',
    placeholder: '#8E8E93',
    messageBackground: {
      own: '#0A84FF',
      other: '#1C1C1E',
    },
    messageText: {
      own: '#FFFFFF',
      other: '#FFFFFF',
    },
    timestamp: {
      own: 'rgba(255,255,255,0.7)',
      other: '#8E8E93',
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system');
  const [theme, setTheme] = useState(systemColorScheme === 'dark' ? darkTheme : lightTheme);

  // Mettre à jour le thème en fonction du mode
  const updateTheme = useCallback(() => {
    let newTheme;
    switch (themeMode) {
      case 'dark':
        newTheme = darkTheme;
        break;
      case 'light':
        newTheme = lightTheme;
        break;
      default: // 'system'
        newTheme = systemColorScheme === 'dark' ? darkTheme : lightTheme;
        break;
    }
    setTheme(newTheme);
  }, [themeMode, systemColorScheme]);

  // Charger le mode de thème sauvegardé
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('@theme_mode');
        if (savedMode) {
          setThemeMode(savedMode);
        }
      } catch (error) {
        console.error('Erreur chargement thème:', error);
      }
    };
    loadThemeMode();
  }, []);

  // Mettre à jour le thème quand le mode change
  useEffect(() => {
    updateTheme();
  }, [updateTheme]);

  // Changer le mode de thème
  const setMode = useCallback(async (mode) => {
    try {
      await AsyncStorage.setItem('@theme_mode', mode);
      setThemeMode(mode);
    } catch (error) {
      console.error('Erreur sauvegarde thème:', error);
    }
  }, []);

  const value = {
    theme,
    mode: themeMode,
    setMode,
    isDark: theme === darkTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
