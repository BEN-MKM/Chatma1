import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Switch,
    Slider
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccessibilityScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        reduceMotion: false,
        increaseContrast: false,
        boldText: false,
        reduceTransparency: false,
        textSize: 1, // 1 est la taille normale
        autoplay: true,
        subtitles: false
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const savedSettings = await AsyncStorage.getItem('@accessibility_settings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.error('Erreur lors du chargement des paramètres:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveSetting = async (key, value) => {
        try {
            const newSettings = { ...settings, [key]: value };
            setSettings(newSettings);
            await AsyncStorage.setItem('@accessibility_settings', JSON.stringify(newSettings));

            // Appliquer les changements
            applyAccessibilityChanges(key, value);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de sauvegarder le paramètre');
            // Restaurer l'ancienne valeur
            setSettings(settings);
        }
    };

    const applyAccessibilityChanges = (key, value) => {
        // Ici, vous pouvez implémenter la logique pour appliquer les changements
        // Par exemple, mettre à jour les styles globaux, les animations, etc.
        switch (key) {
            case 'textSize':
                // Mettre à jour la taille du texte dans l'application
                break;
            case 'boldText':
                // Mettre à jour le poids des polices
                break;
            case 'reduceMotion':
                // Désactiver/activer les animations
                break;
            // etc.
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>Accessibilité</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Affichage */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Affichage</Text>

                    <View style={[styles.card, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Augmenter le contraste
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Améliorer la lisibilité en augmentant le contraste
                                </Text>
                            </View>
                            <Switch
                                value={settings.increaseContrast}
                                onValueChange={(value) => saveSetting('increaseContrast', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.increaseContrast ? theme.primary : theme.textSecondary}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Texte en gras
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Rendre le texte plus lisible en le mettant en gras
                                </Text>
                            </View>
                            <Switch
                                value={settings.boldText}
                                onValueChange={(value) => saveSetting('boldText', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.boldText ? theme.primary : theme.textSecondary}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Réduire la transparence
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Améliorer la lisibilité en réduisant les effets de transparence
                                </Text>
                            </View>
                            <Switch
                                value={settings.reduceTransparency}
                                onValueChange={(value) => saveSetting('reduceTransparency', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.reduceTransparency ? theme.primary : theme.textSecondary}
                            />
                        </View>
                    </View>
                </View>

                {/* Taille du texte */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Taille du texte</Text>

                    <View style={[styles.card, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.textSizeContainer}>
                            <Text style={[styles.textSizeLabel, { color: theme.textSecondary }]}>A</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0.8}
                                maximumValue={1.4}
                                step={0.1}
                                value={settings.textSize}
                                onValueChange={(value) => saveSetting('textSize', value)}
                                minimumTrackTintColor={theme.primary}
                                maximumTrackTintColor={theme.border}
                                thumbTintColor={theme.primary}
                            />
                            <Text style={[styles.textSizeLabelLarge, { color: theme.textSecondary }]}>A</Text>
                        </View>
                        <Text 
                            style={[
                                styles.textSizePreview, 
                                { 
                                    color: theme.text,
                                    fontSize: 16 * settings.textSize
                                }
                            ]}
                        >
                            Taille du texte d'exemple
                        </Text>
                    </View>
                </View>

                {/* Mouvement */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Mouvement</Text>

                    <View style={[styles.card, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Réduire les animations
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Minimiser les animations et les effets de transition
                                </Text>
                            </View>
                            <Switch
                                value={settings.reduceMotion}
                                onValueChange={(value) => saveSetting('reduceMotion', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.reduceMotion ? theme.primary : theme.textSecondary}
                            />
                        </View>
                    </View>
                </View>

                {/* Médias */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Médias</Text>

                    <View style={[styles.card, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Lecture automatique
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Lire automatiquement les vidéos et animations
                                </Text>
                            </View>
                            <Switch
                                value={settings.autoplay}
                                onValueChange={(value) => saveSetting('autoplay', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.autoplay ? theme.primary : theme.textSecondary}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>
                                    Sous-titres automatiques
                                </Text>
                                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                                    Afficher automatiquement les sous-titres lorsque disponibles
                                </Text>
                            </View>
                            <Switch
                                value={settings.subtitles}
                                onValueChange={(value) => saveSetting('subtitles', value)}
                                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                                thumbColor={settings.subtitles ? theme.primary : theme.textSecondary}
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
    textSizeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    textSizeLabel: {
        fontSize: 16,
        marginRight: 8,
    },
    textSizeLabelLarge: {
        fontSize: 24,
        marginLeft: 8,
    },
    slider: {
        flex: 1,
        height: 40,
    },
    textSizePreview: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 8,
    },
});

export default AccessibilityScreen;
