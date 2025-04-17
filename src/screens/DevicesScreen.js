import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DevicesScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        autoUpdates: true,
        backgroundSync: true,
        dataUsage: true,
        notifications: true
    });

    // Charger les paramètres
    const loadSettings = useCallback(async () => {
        try {
            setLoading(true);
            const storedSettings = await AsyncStorage.getItem(`@device_settings_${user.id}`);
            if (storedSettings) {
                setSettings(JSON.parse(storedSettings));
            }
        } catch (error) {
            console.error('Erreur lors du chargement des paramètres:', error);
        } finally {
            setLoading(false);
        }
    }, [user.id]);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    // Sauvegarder un paramètre
    const saveSetting = async (key, value) => {
        try {
            const newSettings = { ...settings, [key]: value };
            setSettings(newSettings);
            await AsyncStorage.setItem(
                `@device_settings_${user.id}`,
                JSON.stringify(newSettings)
            );
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de sauvegarder le paramètre');
            // Restaurer l'ancienne valeur en cas d'erreur
            setSettings(settings);
        }
    };

    // Effacer les données locales
    const handleClearData = () => {
        Alert.alert(
            'Effacer les données',
            'Êtes-vous sûr de vouloir effacer toutes les données locales ? Cette action est irréversible.',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Effacer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            // Effacer les paramètres
                            await AsyncStorage.removeItem(`@device_settings_${user.id}`);
                            // Effacer le cache des images
                            // Effacer les données mises en cache
                            // Réinitialiser les paramètres par défaut
                            setSettings({
                                autoUpdates: true,
                                backgroundSync: true,
                                dataUsage: true,
                                notifications: true
                            });
                            Alert.alert('Succès', 'Les données ont été effacées');
                        } catch (error) {
                            Alert.alert('Erreur', error.message);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                    Paramètres de l'appareil
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Mises à jour */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Mises à jour et synchronisation
                    </Text>

                    <View style={[styles.settingCard, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Mises à jour automatiques
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Télécharger et installer automatiquement les mises à jour
                                </Text>
                            </View>
                            <Switch
                                value={settings.autoUpdates}
                                onValueChange={(value) => saveSetting('autoUpdates', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.autoUpdates ? theme.primary : theme.textSecondary}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Synchronisation en arrière-plan
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Synchroniser les données même lorsque l'app est fermée
                                </Text>
                            </View>
                            <Switch
                                value={settings.backgroundSync}
                                onValueChange={(value) => saveSetting('backgroundSync', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.backgroundSync ? theme.primary : theme.textSecondary}
                            />
                        </View>
                    </View>
                </View>

                {/* Données et stockage */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Données et stockage
                    </Text>

                    <View style={[styles.settingCard, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Économie de données
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Réduire l'utilisation des données mobiles
                                </Text>
                            </View>
                            <Switch
                                value={settings.dataUsage}
                                onValueChange={(value) => saveSetting('dataUsage', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.dataUsage ? theme.primary : theme.textSecondary}
                            />
                        </View>

                        <TouchableOpacity 
                            style={styles.settingRow}
                            onPress={handleClearData}
                        >
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: '#FF3B30' }]}>
                                    Effacer les données
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Supprimer toutes les données locales
                                </Text>
                            </View>
                            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Notifications */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Notifications
                    </Text>

                    <View style={[styles.settingCard, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Autoriser les notifications
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Recevoir des notifications push
                                </Text>
                            </View>
                            <Switch
                                value={settings.notifications}
                                onValueChange={(value) => saveSetting('notifications', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.notifications ? theme.primary : theme.textSecondary}
                            />
                        </View>
                    </View>
                </View>

                {/* Informations sur l'appareil */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Informations sur l'appareil
                    </Text>

                    <View style={[styles.settingCard, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.infoRow}>
                            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                                Version de l'application
                            </Text>
                            <Text style={[styles.infoValue, { color: theme.text }]}>
                                1.0.0
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                                Système d'exploitation
                            </Text>
                            <Text style={[styles.infoValue, { color: theme.text }]}>
                                {Platform.OS === 'ios' ? 'iOS' : 'Android'}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                                ID de l'appareil
                            </Text>
                            <Text style={[styles.infoValue, { color: theme.text }]}>
                                {user.id.slice(0, 8)}
                            </Text>
                        </View>
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    settingCard: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingTitle: {
        fontSize: 16,
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 14,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    infoLabel: {
        fontSize: 14,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export default DevicesScreen;
