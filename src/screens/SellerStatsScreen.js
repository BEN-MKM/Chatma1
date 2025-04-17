import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, DataTable } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';

const SellerStatsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Aperçu des ventes</Title>
          <LineChart
            data={{
              labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
              datasets: [{
                data: [20, 45, 28, 80, 99, 43, 50]
              }]
            }}
            width={350}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
          />
        </Card.Content>
      </Card>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Métrique</DataTable.Title>
          <DataTable.Title numeric>Valeur</DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>Ventes totales</DataTable.Cell>
          <DataTable.Cell numeric>365</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Revenu mensuel</DataTable.Cell>
          <DataTable.Cell numeric>€4,500</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Note moyenne</DataTable.Cell>
          <DataTable.Cell numeric>4.8/5</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    margin: 16,
  },
});

export default SellerStatsScreen;
