import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const defaultTheme = {
  dark: false,
  primary: '#007AFF',
  background: '#ffffff',
  card: '#ffffff',
  text: '#000000',
  textSecondary: '#666666',
  border: '#e0e0e0',
  notification: '#ff3b30',
  surface: '#f5f5f5',
  error: '#ff3b30',
  success: '#34c759',
  warning: '#ffcc00',
  info: '#5856d6',
  inputBackground: '#f5f5f5',
  buttonText: '#ffffff',
  link: '#007AFF',
};

export const darkTheme = {
  dark: true,
  primary: '#0A84FF',
  background: '#000000',
  card: '#1C1C1E',
  text: '#ffffff',
  textSecondary: '#999999',
  border: '#38383A',
  notification: '#FF453A',
  surface: '#2C2C2E',
  error: '#FF453A',
  success: '#32D74B',
  warning: '#FFD60A',
  info: '#5E5CE6',
  inputBackground: '#1C1C1E',
  buttonText: '#ffffff',
  link: '#0A84FF',
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : defaultTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return defaultTheme;
  }
  return context.theme;
};

export default defaultTheme;
