import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useAuth } from '../contexts/AuthContext';
import statsService from '../services/statsService';

const { width } = Dimensions.get('window');

const StatsScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    user: null,
    messages: [],
    products: null,
    transactions: null,
  });
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    loadStats();

    // Souscrire aux mises à jour des statistiques
    const unsubscribe = statsService.subscribeToStats(user.id, (newStats) => {
      setStats(prev => ({ ...prev, user: newStats }));
    });

    return () => {
      unsubscribe();
    };
  }, [user.id, selectedPeriod, loadStats]);

  const loadStats = useCallback(async () => {
    try {
      const [userStats, messageStats, productStats, transactionStats] = await Promise.all([
        statsService.getUserStats(user.id),
        statsService.getMessageStats(user.id, selectedPeriod),
        statsService.getProductStats(user.id),
        statsService.getTransactionStats(user.id, selectedPeriod),
      ]);

      setStats({
        user: userStats,
        messages: messageStats,
        products: productStats,
        transactions: transactionStats,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id, selectedPeriod]);

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      <TouchableOpacity
        style={[styles.periodButton, selectedPeriod === 'day' && styles.selectedPeriod]}
        onPress={() => setSelectedPeriod('day')}
      >
        <Text style={[styles.periodText, selectedPeriod === 'day' && styles.selectedPeriodText]}>
          Jour
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.periodButton, selectedPeriod === 'week' && styles.selectedPeriod]}
        onPress={() => setSelectedPeriod('week')}
      >
        <Text style={[styles.periodText, selectedPeriod === 'week' && styles.selectedPeriodText]}>
          Semaine
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.periodButton, selectedPeriod === 'month' && styles.selectedPeriod]}
        onPress={() => setSelectedPeriod('month')}
      >
        <Text style={[styles.periodText, selectedPeriod === 'month' && styles.selectedPeriodText]}>
          Mois
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderMessageStats = () => {
    if (!stats.messages.length) return null;

    const data = {
      labels: stats.messages.map(item => item.date),
      datasets: [{
        data: stats.messages.map(item => item.count),
      }],
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Messages envoyés</Text>
        <LineChart
          data={data}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    );
  };

  const renderProductStats = () => {
    if (!stats.products) return null;

    const { productsByStatus } = stats.products;
    const data = {
      labels: Object.keys(productsByStatus),
      datasets: [{
        data: Object.values(productsByStatus),
      }],
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Produits par statut</Text>
        <BarChart
          data={data}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(241, 90, 35, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={styles.chart}
        />
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.products.totalProducts}</Text>
            <Text style={styles.statLabel}>Total produits</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.products.totalViews}</Text>
            <Text style={styles.statLabel}>Vues</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.products.totalLikes}</Text>
            <Text style={styles.statLabel}>J'aime</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {stats.products.averagePrice.toFixed(2)}€
            </Text>
            <Text style={styles.statLabel}>Prix moyen</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTransactionStats = () => {
    if (!stats.transactions) return null;

    const transactionData = Object.entries(stats.transactions.transactionsByDay).map(
      ([date, data]) => ({
        date,
        amount: data.amount,
      })
    );

    const data = {
      labels: transactionData.map(item => item.date),
      datasets: [{
        data: transactionData.map(item => item.amount),
      }],
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Transactions</Text>
        <LineChart
          data={data}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {stats.transactions.totalTransactions}
            </Text>
            <Text style={styles.statLabel}>Total transactions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {stats.transactions.totalAmount.toFixed(2)}€
            </Text>
            <Text style={styles.statLabel}>Montant total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {stats.transactions.averageTransactionAmount.toFixed(2)}€
            </Text>
            <Text style={styles.statLabel}>Montant moyen</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistiques</Text>
        <TouchableOpacity onPress={loadStats}>
          <Ionicons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {renderPeriodSelector()}

      {stats.user && (
        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.user.total_messages}</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.user.total_products}</Text>
            <Text style={styles.statLabel}>Produits</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.user.total_sales}</Text>
            <Text style={styles.statLabel}>Ventes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.user.rating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Note</Text>
          </View>
        </View>
      )}

      {renderMessageStats()}
      {renderProductStats()}
      {renderTransactionStats()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedPeriod: {
    backgroundColor: '#007AFF',
  },
  periodText: {
    color: '#666',
  },
  selectedPeriodText: {
    color: '#fff',
  },
  userStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  chartContainer: {
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  chart: {
    borderRadius: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  statItem: {
    width: '50%',
    padding: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default StatsScreen;
