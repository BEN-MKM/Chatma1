export const lightTheme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    surface: '#F8F8F8',
    text: '#000000',
    textSecondary: '#666666',
    border: '#CCCCCC',
    error: '#FF3B30',
    success: '#4CD964',
    messageOutgoing: '#007AFF',
    messageIncoming: '#E9E9EB',
    messageTextOutgoing: '#FFFFFF',
    messageTextIncoming: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: 'bold',
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
    },
  },
  accessibility: {
    minimumTouchTarget: 44,
    borderRadius: 8,
  },
};

export const darkTheme = {
  colors: {
    primary: '#0A84FF',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    border: '#38383A',
    error: '#FF453A',
    success: '#32D74B',
    messageOutgoing: '#0A84FF',
    messageIncoming: '#30303C',
    messageTextOutgoing: '#FFFFFF',
    messageTextIncoming: '#FFFFFF',
  },
  spacing: lightTheme.spacing,
  typography: lightTheme.typography,
  accessibility: lightTheme.accessibility,
};
