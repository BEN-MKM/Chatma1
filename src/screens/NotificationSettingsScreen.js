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

const NotificationSettingsScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        messages: true,
        messagePreview: true,
        likes: true,
        comments: true,
        follows: true,
        mentions: true,
        newPosts: true,
        productUpdates: true,
        orderUpdates: true,
        promotions: false,
        newsletter: false,
        sound: true,
        vibration: true
    });

    // Charger les paramètres
    const loadSettings = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('notification_settings')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = not found
                throw error;
            }

            if (data) {
                setSettings(data.settings);
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

            const { error } = await supabase
                .from('notification_settings')
                .upsert({
                    user_id: user.id,
                    settings: newSettings,
                    updated_at: new Date()
                });

            if (error) throw error;
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de sauvegarder le paramètre');
            // Restaurer l'ancienne valeur
            setSettings(settings);
        }
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Messages */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Messages</Text>

                    <View style={[styles.card, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Messages privés
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Notifications pour les nouveaux messages
                                </Text>
                            </View>
                            <Switch
                                value={settings.messages}
                                onValueChange={(value) => saveSetting('messages', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.messages ? theme.primary : theme.textSecondary}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Aperçu des messages
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Afficher le contenu des messages dans les notifications
                                </Text>
                            </View>
                            <Switch
                                value={settings.messagePreview}
                                onValueChange={(value) => saveSetting('messagePreview', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.messagePreview ? theme.primary : theme.textSecondary}
                            />
                        </View>
                    </View>
                </View>

                {/* Interactions */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Interactions</Text>

                    <View style={[styles.card, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    J'aime
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Quand quelqu'un aime vos publications
                                </Text>
                            </View>
                            <Switch
                                value={settings.likes}
                                onValueChange={(value) => saveSetting('likes', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.likes ? theme.primary : theme.textSecondary}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Commentaires
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Quand quelqu'un commente vos publications
                                </Text>
                            </View>
                            <Switch
                                value={settings.comments}
                                onValueChange={(value) => saveSetting('comments', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.comments ? theme.primary : theme.textSecondary}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Abonnements
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Quand quelqu'un commence à vous suivre
                                </Text>
                            </View>
                            <Switch
                                value={settings.follows}
                                onValueChange={(value) => saveSetting('follows', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.follows ? theme.primary : theme.textSecondary}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Mentions
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Quand quelqu'un vous mentionne
                                </Text>
                            </View>
                            <Switch
                                value={settings.mentions}
                                onValueChange={(value) => saveSetting('mentions', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.mentions ? theme.primary : theme.textSecondary}
                            />
                        </View>
                    </View>
                </View>

                {/* Nouveautés */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Nouveautés</Text>

                    <View style={[styles.card, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Nouvelles publications
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Publications des personnes que vous suivez
                                </Text>
                            </View>
                            <Switch
                                value={settings.newPosts}
                                onValueChange={(value) => saveSetting('newPosts', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.newPosts ? theme.primary : theme.textSecondary}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Mises à jour des produits
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Nouveaux produits et mises à jour
                                </Text>
                            </View>
                            <Switch
                                value={settings.productUpdates}
                                onValueChange={(value) => saveSetting('productUpdates', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.productUpdates ? theme.primary : theme.textSecondary}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Commandes
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Mises à jour de vos commandes
                                </Text>
                            </View>
                            <Switch
                                value={settings.orderUpdates}
                                onValueChange={(value) => saveSetting('orderUpdates', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.orderUpdates ? theme.primary : theme.textSecondary}
                            />
                        </View>
                    </View>
                </View>

                {/* Marketing */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Marketing</Text>

                    <View style={[styles.card, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Promotions
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Offres spéciales et réductions
                                </Text>
                            </View>
                            <Switch
                                value={settings.promotions}
                                onValueChange={(value) => saveSetting('promotions', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.promotions ? theme.primary : theme.textSecondary}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Newsletter
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Actualités et mises à jour mensuelles
                                </Text>
                            </View>
                            <Switch
                                value={settings.newsletter}
                                onValueChange={(value) => saveSetting('newsletter', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.newsletter ? theme.primary : theme.textSecondary}
                            />
                        </View>
                    </View>
                </View>

                {/* Sons et vibrations */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Sons et vibrations</Text>

                    <View style={[styles.card, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Son
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Jouer un son lors des notifications
                                </Text>
                            </View>
                            <Switch
                                value={settings.sound}
                                onValueChange={(value) => saveSetting('sound', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.sound ? theme.primary : theme.textSecondary}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Vibration
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Vibrer lors des notifications
                                </Text>
                            </View>
                            <Switch
                                value={settings.vibration}
                                onValueChange={(value) => saveSetting('vibration', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.vibration ? theme.primary : theme.textSecondary}
                            />
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
    card: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
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
});

export default NotificationSettingsScreen;
