import React, { createContext, useState, useContext } from 'react';

// Create a default context with mock data
const ProfileContext = createContext({
  user: {
    id: '1',
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/100',
    coverImage: 'https://via.placeholder.com/500x200',
    status: 'Hey there! I am using ChatMa'
  },
  stats: {
    posts: 42,
    followers: 1024,
    following: 256
  },
  updateUserProfile: () => {},
  isLoading: false
});

// Provider component
export const ProfileProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: '1',
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/100',
    coverImage: 'https://via.placeholder.com/500x200',
    status: 'Hey there! I am using ChatMa'
  });

  const [stats, setStats] = useState({
    posts: 42,
    followers: 1024,
    following: 256
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateUserProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <ProfileContext.Provider 
      value={{ 
        user, 
        stats, 
        updateUserProfile, 
        isLoading 
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use the profile context
export const useProfile = () => useContext(ProfileContext);
