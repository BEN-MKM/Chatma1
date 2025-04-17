import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TransactionHistoryScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Écran d'Historique des Transactions</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TransactionHistoryScreen;
