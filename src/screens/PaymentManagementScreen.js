import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, List, Divider } from 'react-native-paper';

const PaymentManagementScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.balanceCard}>
        <Card.Content>
          <Text style={styles.balanceTitle}>Solde actuel</Text>
          <Text style={styles.balanceAmount}>€1,234.56</Text>
          <Button mode="contained" style={styles.withdrawButton}>
            Retirer les fonds
          </Button>
        </Card.Content>
      </Card>

      <List.Section>
        <List.Subheader>Méthodes de paiement</List.Subheader>
        <List.Item
          title="Carte Visa **** 1234"
          left={props => <List.Icon {...props} icon="credit-card" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <List.Item
          title="PayPal"
          description="john.doe@email.com"
          left={props => <List.Icon {...props} icon="paypal" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <Button mode="outlined" style={styles.addButton}>
          Ajouter une méthode de paiement
        </Button>
      </List.Section>

      <List.Section>
        <List.Subheader>Historique des transactions</List.Subheader>
        <List.Item
          title="Vente #12345"
          description="17 Feb 2025"
          right={() => <Text>€50.00</Text>}
        />
        <Divider />
        <List.Item
          title="Retrait"
          description="15 Feb 2025"
          right={() => <Text style={styles.withdrawal}>-€200.00</Text>}
        />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  balanceCard: {
    margin: 16,
  },
  balanceTitle: {
    fontSize: 16,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  withdrawButton: {
    marginTop: 8,
  },
  addButton: {
    margin: 16,
  },
  withdrawal: {
    color: 'red',
  },
});

export default PaymentManagementScreen;
