import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

const languages = [
    {
        code: 'fr',
        name: 'Français',
        nativeName: 'Français',
        flag: '🇫🇷'
    },
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇬🇧'
    },
    {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        flag: '🇪🇸'
    },
    {
        code: 'de',
        name: 'German',
        nativeName: 'Deutsch',
        flag: '🇩🇪'
    },
    {
        code: 'it',
        name: 'Italian',
        nativeName: 'Italiano',
        flag: '🇮🇹'
    },
    {
        code: 'pt',
        name: 'Portuguese',
        nativeName: 'Português',
        flag: '🇵🇹'
    },
    {
        code: 'nl',
        name: 'Dutch',
        nativeName: 'Nederlands',
        flag: '🇳🇱'
    },
    {
        code: 'pl',
        name: 'Polish',
        nativeName: 'Polski',
        flag: '🇵🇱'
    },
    {
        code: 'ru',
        name: 'Russian',
        nativeName: 'Русский',
        flag: '🇷🇺'
    },
    {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        flag: '🇸🇦'
    },
    {
        code: 'ja',
        name: 'Japanese',
        nativeName: '日本語',
        flag: '🇯🇵'
    },
    {
        code: 'ko',
        name: 'Korean',
        nativeName: '한국어',
        flag: '🇰🇷'
    },
    {
        code: 'zh',
        name: 'Chinese',
        nativeName: '中文',
        flag: '🇨🇳'
    }
];

const LanguageScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [selectedLanguage, setSelectedLanguage] = useState('fr');
    const [systemLanguage, setSystemLanguage] = useState('');
    const [useSystemLanguage, setUseSystemLanguage] = useState(true);

    useEffect(() => {
        loadLanguageSettings();
    }, []);

    const loadLanguageSettings = async () => {
        try {
            setLoading(true);
            // Récupérer la langue système
            const deviceLanguage = Localization.locale.split('-')[0];
            setSystemLanguage(deviceLanguage);

            // Récupérer les paramètres sauvegardés
            const savedSettings = await AsyncStorage.getItem('@language_settings');
            if (savedSettings) {
                const { language, useSystem } = JSON.parse(savedSettings);
                setSelectedLanguage(language);
                setUseSystemLanguage(useSystem);
            } else {
                // Par défaut, utiliser la langue système
                setSelectedLanguage(deviceLanguage);
                setUseSystemLanguage(true);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des paramètres de langue:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageSelect = async (languageCode) => {
        try {
            setLoading(true);
            
            // Sauvegarder les paramètres
            await AsyncStorage.setItem('@language_settings', JSON.stringify({
                language: languageCode,
                useSystem: false
            }));

            setSelectedLanguage(languageCode);
            setUseSystemLanguage(false);

            // Ici, vous pourriez appeler une fonction pour changer la langue de l'application
            // changeAppLanguage(languageCode);

            Alert.alert(
                'Succès',
                'La langue a été changée avec succès. Certains changements prendront effet au prochain redémarrage de l\'application.'
            );
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de changer la langue');
        } finally {
            setLoading(false);
        }
    };

    const handleUseSystemLanguage = async () => {
        try {
            setLoading(true);
            
            // Sauvegarder les paramètres
            await AsyncStorage.setItem('@language_settings', JSON.stringify({
                language: systemLanguage,
                useSystem: true
            }));

            setSelectedLanguage(systemLanguage);
            setUseSystemLanguage(true);

            // Ici, vous pourriez appeler une fonction pour changer la langue de l'application
            // changeAppLanguage(systemLanguage);

            Alert.alert(
                'Succès',
                'L\'application utilisera maintenant la langue système'
            );
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de changer la langue');
        } finally {
            setLoading(false);
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>Langue</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Option langue système */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={[styles.systemLanguageCard, { backgroundColor: theme.inputBackground }]}
                        onPress={handleUseSystemLanguage}
                    >
                        <View style={styles.languageInfo}>
                            <Text style={[styles.systemLanguageTitle, { color: theme.text }]}>
                                Utiliser la langue système
                            </Text>
                            <Text style={[styles.systemLanguageDescription, { color: theme.textSecondary }]}>
                                L'application s'adaptera automatiquement à la langue de votre appareil
                            </Text>
                        </View>
                        {useSystemLanguage && (
                            <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Liste des langues */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Toutes les langues
                    </Text>

                    <View style={[styles.languagesCard, { backgroundColor: theme.inputBackground }]}>
                        {languages.map((language, index) => (
                            <TouchableOpacity
                                key={language.code}
                                style={[
                                    styles.languageRow,
                                    index < languages.length - 1 && styles.borderBottom,
                                    { borderBottomColor: theme.border }
                                ]}
                                onPress={() => handleLanguageSelect(language.code)}
                            >
                                <View style={styles.languageInfo}>
                                    <Text style={styles.flag}>{language.flag}</Text>
                                    <View style={styles.languageNames}>
                                        <Text style={[styles.languageName, { color: theme.text }]}>
                                            {language.name}
                                        </Text>
                                        <Text style={[styles.languageNative, { color: theme.textSecondary }]}>
                                            {language.nativeName}
                                        </Text>
                                    </View>
                                </View>
                                {selectedLanguage === language.code && !useSystemLanguage && (
                                    <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
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
    systemLanguageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
    },
    languageInfo: {
        flex: 1,
        marginRight: 16,
    },
    systemLanguageTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    systemLanguageDescription: {
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    languagesCard: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    languageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    borderBottom: {
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    flag: {
        fontSize: 24,
        marginRight: 12,
    },
    languageNames: {
        flex: 1,
    },
    languageName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    languageNative: {
        fontSize: 14,
    },
});

export default LanguageScreen;
