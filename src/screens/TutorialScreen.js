import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';

const TutorialScreen = ({ navigation }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  const tutorialData = [
    {
      title: "Bienvenue sur ChatMa",
      description: "Découvrez une nouvelle façon de communiquer et de faire du commerce",
      icon: "chat",
    },
    {
      title: "Messagerie instantanée",
      description: "Chattez avec vos contacts et partagez des médias facilement",
      icon: "message",
    },
    {
      title: "Marketplace intégrée",
      description: "Achetez et vendez directement depuis l'application",
      icon: "store",
    },
    {
      title: "Paiements sécurisés",
      description: "Effectuez vos transactions en toute sécurité",
      icon: "security",
    },
  ];

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setActiveSlide(slideIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {tutorialData.map((item, index) => (
          <View key={index} style={[styles.slide, { width: screenWidth }]}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.pagination}>
        {tutorialData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeSlide && styles.paginationDotActive
            ]}
          />
        ))}
      </View>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.replace('MainApp')}
      >
        {activeSlide === tutorialData.length - 1 ? "Commencer" : "Suivant"}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#ccc',
  },
  paginationDotActive: {
    backgroundColor: '#000',
  },
  button: {
    margin: 16,
  },
});

export default TutorialScreen;
