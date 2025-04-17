import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SalesStatsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('week'); // week, month, year
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    topProducts: [],
    salesByDay: [],
    customerRetention: 0,
    conversionRate: 0
  });

  useEffect(() => {
    loadStats();
  }, [timeFrame]);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStats = {
        totalSales: Math.floor(Math.random() * 1000),
        totalRevenue: Math.floor(Math.random() * 50000),
        averageOrderValue: Math.floor(Math.random() * 200) + 50,
        topProducts: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          name: `Produit ${i + 1}`,
          sales: Math.floor(Math.random() * 100),
          revenue: Math.floor(Math.random() * 5000)
        })),
        salesByDay: Array.from({ length: 7 }, (_, i) => ({
          day: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { weekday: 'short' }),
          sales: Math.floor(Math.random() * 50)
        })),
        customerRetention: Math.floor(Math.random() * 40) + 60,
        conversionRate: Math.floor(Math.random() * 20) + 10
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTimeFrameSelector = () => (
    <View style={styles.timeFrameContainer}>
      <TouchableOpacity
        style={[styles.timeFrameButton, timeFrame === 'week' && styles.activeTimeFrame]}
        onPress={() => setTimeFrame('week')}
      >
        <Text style={[styles.timeFrameText, timeFrame === 'week' && styles.activeTimeFrameText]}>
          Semaine
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.timeFrameButton, timeFrame === 'month' && styles.activeTimeFrame]}
        onPress={() => setTimeFrame('month')}
      >
        <Text style={[styles.timeFrameText, timeFrame === 'month' && styles.activeTimeFrameText]}>
          Mois
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.timeFrameButton, timeFrame === 'year' && styles.activeTimeFrame]}
        onPress={() => setTimeFrame('year')}
      >
        <Text style={[styles.timeFrameText, timeFrame === 'year' && styles.activeTimeFrameText]}>
          Année
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {renderTimeFrameSelector()}

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Ventes Totales</Text>
          <Text style={styles.statValue}>{stats.totalSales}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Revenu Total</Text>
          <Text style={styles.statValue}>{stats.totalRevenue} €</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Panier Moyen</Text>
          <Text style={styles.statValue}>{stats.averageOrderValue} €</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Produits</Text>
        {stats.topProducts.map((product, index) => (
          <View key={product.id} style={styles.productRow}>
            <Text style={styles.productRank}>#{index + 1}</Text>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.productStats}>
              <Text style={styles.productSales}>{product.sales} ventes</Text>
              <Text style={styles.productRevenue}>{product.revenue} €</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ventes par Jour</Text>
        <View style={styles.chartContainer}>
          {stats.salesByDay.map((day, index) => (
            <View key={index} style={styles.chartBar}>
              <View style={[styles.bar, { height: day.sales * 2 }]} />
              <Text style={styles.barLabel}>{day.day}</Text>
              <Text style={styles.barValue}>{day.sales}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Fidélisation Client</Text>
          <Text style={styles.metricValue}>{stats.customerRetention}%</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Taux de Conversion</Text>
          <Text style={styles.metricValue}>{stats.conversionRate}%</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeFrameContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  timeFrameButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTimeFrame: {
    backgroundColor: '#2196F3',
  },
  timeFrameText: {
    color: '#666',
  },
  activeTimeFrameText: {
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productRank: {
    width: 30,
    fontSize: 12,
    color: '#666',
  },
  productName: {
    flex: 1,
    fontSize: 14,
  },
  productStats: {
    alignItems: 'flex-end',
  },
  productSales: {
    fontSize: 12,
    color: '#666',
  },
  productRevenue: {
    fontSize: 12,
    color: '#2196F3',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 200,
    alignItems: 'flex-end',
    paddingTop: 20,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: 20,
    backgroundColor: '#2196F3',
    borderRadius: 10,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 5,
    color: '#666',
  },
  barValue: {
    fontSize: 10,
    color: '#666',
  },
  metricsContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#2196F3',
  },
});

export default SalesStatsScreen;
