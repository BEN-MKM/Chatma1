import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../config/supabase';

const PrivacyScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        isPrivate: false,
        showActivity: true,
        showLastSeen: true,
        allowMessages: true,
        allowTagging: true
    });

    // Charger les paramètres de confidentialité
    useEffect(() => {
        loadPrivacySettings();
    }, [loadPrivacySettings]);

    const loadPrivacySettings = React.useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('privacy_settings')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) throw error;

            if (data) {
                setSettings({
                    isPrivate: data.is_private,
                    showActivity: data.show_activity,
                    showLastSeen: data.show_last_seen,
                    allowMessages: data.allow_messages,
                    allowTagging: data.allow_tagging
                });
            }
        } catch (error) {
            console.error('Erreur lors du chargement des paramètres:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const updateSetting = async (key, value) => {
        try {
            setSaving(true);
            const updates = {
                user_id: user.id,
                [key]: value,
                updated_at: new Date()
            };

            const { error } = await supabase
                .from('privacy_settings')
                .upsert(updates);

            if (error) throw error;

            setSettings(prev => ({ ...prev, [key]: value }));
        } catch (error) {
            Alert.alert('Erreur', error.message);
            // Restaurer l'ancienne valeur en cas d'erreur
            setSettings(prev => ({ ...prev }));
        } finally {
            setSaving(false);
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>Confidentialité</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Paramètres du compte</Text>

                    <View style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="lock-closed-outline" size={22} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Compte privé</Text>
                        </View>
                        <Switch
                            value={settings.isPrivate}
                            onValueChange={(value) => updateSetting('is_private', value)}
                            trackColor={{ false: '#767577', true: theme.primary }}
                            thumbColor={settings.isPrivate ? '#fff' : '#f4f3f4'}
                            disabled={saving}
                        />
                    </View>

                    <View style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="eye-outline" size={22} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Afficher mon activité</Text>
                        </View>
                        <Switch
                            value={settings.showActivity}
                            onValueChange={(value) => updateSetting('show_activity', value)}
                            trackColor={{ false: '#767577', true: theme.primary }}
                            thumbColor={settings.showActivity ? '#fff' : '#f4f3f4'}
                            disabled={saving}
                        />
                    </View>

                    <View style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="time-outline" size={22} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Afficher ma dernière connexion</Text>
                        </View>
                        <Switch
                            value={settings.showLastSeen}
                            onValueChange={(value) => updateSetting('show_last_seen', value)}
                            trackColor={{ false: '#767577', true: theme.primary }}
                            thumbColor={settings.showLastSeen ? '#fff' : '#f4f3f4'}
                            disabled={saving}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Interactions</Text>

                    <View style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="chatbubble-outline" size={22} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Autoriser les messages</Text>
                        </View>
                        <Switch
                            value={settings.allowMessages}
                            onValueChange={(value) => updateSetting('allow_messages', value)}
                            trackColor={{ false: '#767577', true: theme.primary }}
                            thumbColor={settings.allowMessages ? '#fff' : '#f4f3f4'}
                            disabled={saving}
                        />
                    </View>

                    <View style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="at-outline" size={22} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Autoriser les mentions</Text>
                        </View>
                        <Switch
                            value={settings.allowTagging}
                            onValueChange={(value) => updateSetting('allow_tagging', value)}
                            trackColor={{ false: '#767577', true: theme.primary }}
                            thumbColor={settings.allowTagging ? '#fff' : '#f4f3f4'}
                            disabled={saving}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Blocage</Text>

                    <TouchableOpacity 
                        style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}
                        onPress={() => navigation.navigate('BlockedUsers')}
                    >
                        <View style={styles.settingLeft}>
                            <Ionicons name="ban-outline" size={22} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Utilisateurs bloqués</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity 
                        style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}
                        onPress={() => navigation.navigate('DataPrivacy')}
                    >
                        <View style={styles.settingLeft}>
                            <Ionicons name="document-text-outline" size={22} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Politique de confidentialité</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}
                        onPress={() => navigation.navigate('DataDownload')}
                    >
                        <View style={styles.settingLeft}>
                            <Ionicons name="download-outline" size={22} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Télécharger mes données</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
                    </TouchableOpacity>
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
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingText: {
        fontSize: 16,
        marginLeft: 12,
    },
});

export default PrivacyScreen;
