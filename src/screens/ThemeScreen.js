import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const themes = [
    {
        id: 'system',
        name: 'Système',
        description: 'Suivre le thème de l\'appareil',
        icon: 'phone-portrait-outline'
    },
    {
        id: 'light',
        name: 'Clair',
        description: 'Thème lumineux',
        icon: 'sunny-outline'
    },
    {
        id: 'dark',
        name: 'Sombre',
        description: 'Thème sombre',
        icon: 'moon-outline'
    }
];

const colors = [
    {
        id: 'blue',
        name: 'Bleu',
        color: '#007AFF',
        textColor: '#FFFFFF'
    },
    {
        id: 'purple',
        name: 'Violet',
        color: '#5856D6',
        textColor: '#FFFFFF'
    },
    {
        id: 'pink',
        name: 'Rose',
        color: '#FF2D55',
        textColor: '#FFFFFF'
    },
    {
        id: 'orange',
        name: 'Orange',
        color: '#FF9500',
        textColor: '#FFFFFF'
    },
    {
        id: 'green',
        name: 'Vert',
        color: '#34C759',
        textColor: '#FFFFFF'
    },
    {
        id: 'teal',
        name: 'Turquoise',
        color: '#5AC8FA',
        textColor: '#FFFFFF'
    }
];

const ThemeScreen = ({ navigation }) => {
    const { theme, setTheme, setPrimaryColor } = useTheme();
    const systemColorScheme = useColorScheme();
    const [loading, setLoading] = useState(true);
    const [selectedTheme, setSelectedTheme] = useState('system');
    const [selectedColor, setSelectedColor] = useState('blue');

    useEffect(() => {
        loadThemeSettings();
    }, []);

    const loadThemeSettings = async () => {
        try {
            setLoading(true);
            const savedSettings = await AsyncStorage.getItem('@theme_settings');
            if (savedSettings) {
                const { theme, color } = JSON.parse(savedSettings);
                setSelectedTheme(theme);
                setSelectedColor(color);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des paramètres de thème:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleThemeSelect = async (themeId) => {
        try {
            setLoading(true);
            
            // Sauvegarder les paramètres
            await AsyncStorage.setItem('@theme_settings', JSON.stringify({
                theme: themeId,
                color: selectedColor
            }));

            setSelectedTheme(themeId);

            // Appliquer le thème
            if (themeId === 'system') {
                setTheme(systemColorScheme);
            } else {
                setTheme(themeId);
            }

            Alert.alert('Succès', 'Le thème a été changé');
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de changer le thème');
        } finally {
            setLoading(false);
        }
    };

    const handleColorSelect = async (colorId) => {
        try {
            setLoading(true);
            
            // Sauvegarder les paramètres
            await AsyncStorage.setItem('@theme_settings', JSON.stringify({
                theme: selectedTheme,
                color: colorId
            }));

            setSelectedColor(colorId);

            // Appliquer la couleur
            const selectedColorObj = colors.find(c => c.id === colorId);
            if (selectedColorObj) {
                setPrimaryColor(selectedColorObj.color);
            }

            Alert.alert('Succès', 'La couleur a été changée');
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de changer la couleur');
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>Thème</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Sélection du thème */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Apparence
                    </Text>

                    <View style={[styles.themesCard, { backgroundColor: theme.inputBackground }]}>
                        {themes.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.themeRow,
                                    index < themes.length - 1 && styles.borderBottom,
                                    { borderBottomColor: theme.border }
                                ]}
                                onPress={() => handleThemeSelect(item.id)}
                            >
                                <View style={styles.themeInfo}>
                                    <Ionicons name={item.icon} size={24} color={theme.text} />
                                    <View style={styles.themeDetails}>
                                        <Text style={[styles.themeName, { color: theme.text }]}>
                                            {item.name}
                                        </Text>
                                        <Text style={[styles.themeDescription, { color: theme.textSecondary }]}>
                                            {item.description}
                                        </Text>
                                    </View>
                                </View>
                                {selectedTheme === item.id && (
                                    <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Sélection de la couleur */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Couleur d'accentuation
                    </Text>

                    <View style={styles.colorsGrid}>
                        {colors.map(color => (
                            <TouchableOpacity
                                key={color.id}
                                style={[
                                    styles.colorButton,
                                    { backgroundColor: color.color },
                                    selectedColor === color.id && styles.selectedColor
                                ]}
                                onPress={() => handleColorSelect(color.id)}
                            >
                                {selectedColor === color.id && (
                                    <Ionicons 
                                        name="checkmark" 
                                        size={24} 
                                        color={color.textColor} 
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Aperçu */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Aperçu
                    </Text>

                    <View style={[styles.previewCard, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.previewHeader}>
                            <View style={styles.previewTitle}>
                                <View style={[styles.previewDot, { backgroundColor: theme.primary }]} />
                                <Text style={[styles.previewTitleText, { color: theme.text }]}>
                                    Titre de l'aperçu
                                </Text>
                            </View>
                            <TouchableOpacity>
                                <Text style={[styles.previewButton, { color: theme.primary }]}>
                                    Action
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.previewContent, { color: theme.textSecondary }]}>
                            Voici un exemple de texte qui montre comment votre thème apparaîtra 
                            dans l'application. Les couleurs et contrastes sont ajustés pour une 
                            lisibilité optimale.
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    themesCard: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    themeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    borderBottom: {
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    themeInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    themeDetails: {
        marginLeft: 12,
        flex: 1,
    },
    themeName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    themeDescription: {
        fontSize: 14,
    },
    colorsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6,
    },
    colorButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        margin: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedColor: {
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    previewCard: {
        borderRadius: 12,
        padding: 16,
    },
    previewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    previewTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    previewDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    previewTitleText: {
        fontSize: 16,
        fontWeight: '600',
    },
    previewButton: {
        fontSize: 16,
        fontWeight: '500',
    },
    previewContent: {
        fontSize: 14,
        lineHeight: 20,
    },
});

export default ThemeScreen;
