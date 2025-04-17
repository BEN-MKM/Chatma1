import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../config/supabase';
import * as Device from 'expo-device';

const SessionsScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);

    const loadSessions = useCallback(async () => {
        try {
            setLoading(true);
            const { data: { sessions }, error } = await supabase.auth.admin.listUserSessions(user.id);

            if (error) throw error;

            // Identifier la session courante
            const currentSession = sessions.find(session => 
                session.created_at === user?.session?.created_at
            );
            setCurrentSessionId(currentSession?.id);

            // Formater les sessions avec des informations plus détaillées
            const formattedSessions = sessions.map(session => ({
                ...session,
                deviceInfo: parseUserAgent(session.user_agent)
            }));

            setSessions(formattedSessions);
        } catch (error) {
            console.error('Erreur lors du chargement des sessions:', error);
            Alert.alert('Erreur', 'Impossible de charger les sessions');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    const parseUserAgent = (userAgent) => {
        const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
        const isTablet = /Tablet|iPad/i.test(userAgent);
        const isDesktop = !isMobile && !isTablet;

        let deviceType = 'desktop';
        let iconName = 'desktop-outline';

        if (isMobile) {
            deviceType = 'mobile';
            iconName = 'phone-portrait-outline';
        } else if (isTablet) {
            deviceType = 'tablet';
            iconName = 'tablet-landscape-outline';
        }

        return { deviceType, iconName };
    };

    const handleTerminateSession = async (sessionId) => {
        if (sessionId === currentSessionId) {
            Alert.alert(
                'Attention',
                'Vous ne pouvez pas terminer votre session actuelle ici. Utilisez plutôt le bouton de déconnexion dans les paramètres.',
                [{ text: 'OK' }]
            );
            return;
        }

        Alert.alert(
            'Terminer la session',
            'Êtes-vous sûr de vouloir terminer cette session ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Terminer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { error } = await supabase.auth.admin.deleteSession(sessionId);
                            if (error) throw error;
                            
                            setSessions(prev => prev.filter(s => s.id !== sessionId));
                            Alert.alert('Succès', 'La session a été terminée');
                        } catch (error) {
                            Alert.alert('Erreur', error.message);
                        }
                    }
                }
            ]
        );
    };

    const handleTerminateAllSessions = () => {
        Alert.alert(
            'Terminer toutes les sessions',
            'Êtes-vous sûr de vouloir terminer toutes les autres sessions ? Vous resterez connecté sur cet appareil.',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Terminer tout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { error } = await supabase.auth.admin.deleteAllSessions(user.id, [currentSessionId]);
                            if (error) throw error;
                            
                            setSessions(prev => prev.filter(s => s.id === currentSessionId));
                            Alert.alert('Succès', 'Toutes les autres sessions ont été terminées');
                        } catch (error) {
                            Alert.alert('Erreur', error.message);
                        }
                    }
                }
            ]
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>Sessions actives</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Appareil actuel */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Cet appareil</Text>
                    <View style={[styles.sessionCard, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.sessionHeader}>
                            <View style={styles.deviceInfo}>
                                <Ionicons 
                                    name={Device.isTablet ? 'tablet-landscape-outline' : 'phone-portrait-outline'} 
                                    size={24} 
                                    color={theme.primary} 
                                />
                                <View style={styles.deviceDetails}>
                                    <Text style={[styles.deviceName, { color: theme.text }]}>
                                        {Device.modelName || 'Appareil actuel'}
                                    </Text>
                                    <Text style={[styles.sessionInfo, { color: theme.textSecondary }]}>
                                        Session active
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.currentBadge, { backgroundColor: theme.primary + '20' }]}>
                                <Text style={[styles.currentText, { color: theme.primary }]}>Actuel</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Autres sessions */}
                {sessions.length > 1 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Autres sessions</Text>
                            <TouchableOpacity 
                                style={styles.terminateAll}
                                onPress={handleTerminateAllSessions}
                            >
                                <Text style={[styles.terminateAllText, { color: theme.primary }]}>
                                    Tout terminer
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {sessions
                            .filter(session => session.id !== currentSessionId)
                            .map(session => (
                                <View 
                                    key={session.id}
                                    style={[styles.sessionCard, { backgroundColor: theme.inputBackground }]}
                                >
                                    <View style={styles.sessionHeader}>
                                        <View style={styles.deviceInfo}>
                                            <Ionicons 
                                                name={session.deviceInfo.iconName}
                                                size={24} 
                                                color={theme.text} 
                                            />
                                            <View style={styles.deviceDetails}>
                                                <Text style={[styles.deviceName, { color: theme.text }]}>
                                                    {session.deviceInfo.deviceType.charAt(0).toUpperCase() + 
                                                    session.deviceInfo.deviceType.slice(1)}
                                                </Text>
                                                <Text style={[styles.sessionInfo, { color: theme.textSecondary }]}>
                                                    Dernière activité : {formatDate(session.updated_at)}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => handleTerminateSession(session.id)}
                                        >
                                            <Ionicons name="close-circle-outline" size={24} color="#FF3B30" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                    </View>
                )}

                <Text style={[styles.disclaimer, { color: theme.textSecondary }]}>
                    Si vous remarquez une activité suspecte, terminez la session et changez votre mot de passe immédiatement.
                </Text>
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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    terminateAll: {
        paddingVertical: 4,
    },
    terminateAllText: {
        fontSize: 14,
        fontWeight: '600',
    },
    sessionCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    deviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    deviceDetails: {
        marginLeft: 12,
        flex: 1,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    sessionInfo: {
        fontSize: 14,
    },
    currentBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    currentText: {
        fontSize: 12,
        fontWeight: '600',
    },
    disclaimer: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 40,
        paddingBottom: 24,
    },
});

export default SessionsScreen;
