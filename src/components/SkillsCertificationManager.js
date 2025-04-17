import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SkillsCertificationManager = () => {
  const [skills, setSkills] = useState([
    {
      id: '1',
      name: 'React Native',
      level: 'Expert',
      icon: 'logo-react'
    },
    {
      id: '2',
      name: 'Project Management',
      level: 'Avancé',
      icon: 'briefcase-outline'
    }
  ]);

  const [certifications, setCertifications] = useState([
    {
      id: '1',
      name: 'Certification Google Cloud',
      issuer: 'Google',
      date: 'Mars 2023',
      icon: 'https://via.placeholder.com/50'
    },
    {
      id: '2',
      name: 'Scrum Master',
      issuer: 'Scrum Alliance',
      date: 'Janvier 2022',
      icon: 'https://via.placeholder.com/50'
    }
  ]);

  const renderSkill = ({ item }) => (
    <View style={styles.skillItem}>
      <Ionicons name={item.icon} size={24} color="#007AFF" />
      <View style={styles.skillDetails}>
        <Text style={styles.skillName}>{item.name}</Text>
        <Text style={styles.skillLevel}>{item.level}</Text>
      </View>
    </View>
  );

  const renderCertification = ({ item }) => (
    <View style={styles.certificationItem}>
      <Image 
        source={{ uri: item.icon }} 
        style={styles.certificationIcon} 
      />
      <View style={styles.certificationDetails}>
        <Text style={styles.certificationName}>{item.name}</Text>
        <Text style={styles.certificationIssuer}>
          {item.issuer} - {item.date}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Compétences</Text>
          <TouchableOpacity>
            <Text style={styles.addButton}>+ Ajouter</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={skills}
          renderItem={renderSkill}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.skillsList}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          <TouchableOpacity>
            <Text style={styles.addButton}>+ Ajouter</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={certifications}
          renderItem={renderCertification}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.certificationsList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginBottom: 15
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  addButton: {
    color: '#007AFF',
    fontSize: 16
  },
  skillsList: {
    marginTop: 10
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#F2F2F7',
    padding: 10,
    borderRadius: 10
  },
  skillDetails: {
    marginLeft: 10
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600'
  },
  skillLevel: {
    fontSize: 14,
    color: '#666'
  },
  certificationsList: {
    marginTop: 10
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#F2F2F7',
    padding: 10,
    borderRadius: 10
  },
  certificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10
  },
  certificationDetails: {
    flex: 1
  },
  certificationName: {
    fontSize: 16,
    fontWeight: '600'
  },
  certificationIssuer: {
    fontSize: 14,
    color: '#666'
  }
});

export default SkillsCertificationManager;
