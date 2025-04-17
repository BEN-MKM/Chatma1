import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';

const HelpSupportScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Aide et Support</Text>
            <Text style={styles.subtitle}>Questions Fréquemment Posées</Text>
            <Text style={styles.faq}>1. Comment créer un compte ?
                
                Pour créer un compte, cliquez sur 'S'inscrire' et suivez les étapes.
            </Text>
            <Text style={styles.faq}>2. Comment réinitialiser mon mot de passe ?
                
                Cliquez sur 'Mot de passe oublié' sur l'écran de connexion et suivez les instructions.
            </Text>
            <Text style={styles.faq}>3. Comment contacter le support ?
                
                Vous pouvez nous contacter via le bouton ci-dessous.
            </Text>
            <Button title='Contacter le Support' onPress={() => alert('Contactez-nous à support@chatma.com')} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    faq: {
        marginBottom: 15,
        fontSize: 16,
    }
});

export default HelpSupportScreen;
