import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../config/supabase';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const DataDownloadScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const dataTypes = [
        {
            id: 'profile',
            title: 'Profil',
            description: 'Vos informations personnelles, photo de profil et paramètres',
            icon: 'person-outline',
            table: 'profiles'
        },
        {
            id: 'posts',
            title: 'Publications',
            description: 'Vos publications, photos et vidéos partagées',
            icon: 'images-outline',
            table: 'posts'
        },
        {
            id: 'messages',
            title: 'Messages',
            description: 'Vos conversations et messages privés',
            icon: 'chatbubbles-outline',
            table: 'messages'
        },
        {
            id: 'products',
            title: 'Produits',
            description: 'Vos produits mis en vente',
            icon: 'cart-outline',
            table: 'products'
        },
        {
            id: 'orders',
            title: 'Commandes',
            description: 'Votre historique d\'achats et de ventes',
            icon: 'receipt-outline',
            table: 'orders'
        }
    ];

    const fetchUserData = async () => {
        const userData = {
            timestamp: new Date().toISOString(),
            user_email: user.email,
            data: {}
        };

        let progress = 0;
        const increment = 100 / dataTypes.length;

        for (const type of dataTypes) {
            try {
                const { data, error } = await supabase
                    .from(type.table)
                    .select('*')
                    .eq('user_id', user.id);

                if (error) throw error;

                userData.data[type.id] = data;
                
                progress += increment;
                setProgress(Math.round(progress));

            } catch (error) {
                console.error(`Erreur lors de la récupération des ${type.id}:`, error);
                userData.data[type.id] = { error: error.message };
            }
        }

        return userData;
    };

    const handleDownload = async () => {
        try {
            setLoading(true);
            setProgress(0);

            // Récupérer les données
            const userData = await fetchUserData();

            // Convertir en JSON
            const jsonData = JSON.stringify(userData, null, 2);

            // Créer le fichier
            const fileName = `chatma_data_${new Date().toISOString().split('T')[0]}.json`;
            const filePath = `${FileSystem.documentDirectory}${fileName}`;

            await FileSystem.writeAsStringAsync(filePath, jsonData, {
                encoding: FileSystem.EncodingType.UTF8
            });

            // Partager le fichier
            if (Platform.OS === 'android') {
                const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
                if (permissions.granted) {
                    const base64 = await FileSystem.readAsStringAsync(filePath, {
                        encoding: FileSystem.EncodingType.Base64
                    });
                    
                    await FileSystem.StorageAccessFramework.createFileAsync(
                        permissions.directoryUri,
                        fileName,
                        'application/json'
                    ).then(async (uri) => {
                        await FileSystem.writeAsStringAsync(uri, base64, {
                            encoding: FileSystem.EncodingType.Base64
                        });
                    });
                }
            } else {
                await Sharing.shareAsync(filePath);
            }

            Alert.alert(
                'Succès',
                'Vos données ont été téléchargées avec succès',
                [{ text: 'OK', onPress: () => setProgress(0) }]
            );

        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            Alert.alert('Erreur', 'Impossible de télécharger vos données');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                    Télécharger mes données
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Introduction */}
                <View style={styles.section}>
                    <Text style={[styles.description, { color: theme.textSecondary }]}>
                        Vous pouvez télécharger une copie de vos données personnelles au format JSON. 
                        Le fichier contiendra toutes les informations listées ci-dessous.
                    </Text>
                </View>

                {/* Liste des données */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Données incluses
                    </Text>

                    {dataTypes.map((type) => (
                        <View 
                            key={type.id}
                            style={[styles.dataTypeCard, { backgroundColor: theme.inputBackground }]}
                        >
                            <Ionicons name={type.icon} size={24} color={theme.text} />
                            <View style={styles.dataTypeInfo}>
                                <Text style={[styles.dataTypeTitle, { color: theme.text }]}>
                                    {type.title}
                                </Text>
                                <Text style={[styles.dataTypeDescription, { color: theme.textSecondary }]}>
                                    {type.description}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Bouton de téléchargement */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={[styles.downloadButton, { 
                            backgroundColor: loading ? theme.inputBackground : theme.primary,
                            opacity: loading ? 0.7 : 1
                        }]}
                        onPress={handleDownload}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <ActivityIndicator color={theme.text} style={styles.loader} />
                                <Text style={[styles.downloadButtonText, { color: theme.text }]}>
                                    {progress}%
                                </Text>
                            </>
                        ) : (
                            <>
                                <Ionicons name="download-outline" size={24} color="white" />
                                <Text style={styles.downloadButtonText}>
                                    Télécharger mes données
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Note de confidentialité */}
                <View style={styles.section}>
                    <View style={[styles.noteCard, { backgroundColor: theme.inputBackground }]}>
                        <Ionicons name="information-circle-outline" size={24} color={theme.primary} />
                        <Text style={[styles.noteText, { color: theme.textSecondary }]}>
                            La préparation de vos données peut prendre quelques minutes. 
                            Le fichier sera téléchargé au format JSON et pourra être ouvert 
                            avec n'importe quel éditeur de texte.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    dataTypeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    dataTypeInfo: {
        marginLeft: 12,
        flex: 1,
    },
    dataTypeTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    dataTypeDescription: {
        fontSize: 14,
    },
    downloadButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    downloadButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    loader: {
        marginRight: 8,
    },
    noteCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    noteText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        lineHeight: 20,
    },
});

export default DataDownloadScreen;
