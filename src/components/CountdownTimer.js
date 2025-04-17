import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

export const CountdownTimer = ({ endTime, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime) - new Date();
      
      if (difference <= 0) {
        setTimeLeft('Terminé');
        if (onFinish) onFinish();
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [endTime, onFinish]);

  return (
    <Text style={styles.timer}>{timeLeft}</Text>
  );
};

const styles = StyleSheet.create({
  timer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4444',
  },
});
