import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PaymentMethodsScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Écran de Gestion des Méthodes de Paiement</Text>
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

export default PaymentMethodsScreen;
