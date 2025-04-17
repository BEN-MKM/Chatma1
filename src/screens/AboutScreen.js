import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import Constants from 'expo-constants';

const AboutScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const appVersion = Constants.manifest.version || '1.0.0';

    const handleLinkPress = async (url) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>À propos</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Logo et Version */}
                <View style={styles.logoSection}>
                    <View style={[styles.logoContainer, { backgroundColor: theme.primary }]}>
                        <Text style={styles.logoText}>ChatMa</Text>
                    </View>
                    <Text style={[styles.version, { color: theme.text }]}>
                        Version {appVersion}
                    </Text>
                    <Text style={[styles.platform, { color: theme.textSecondary }]}>
                        {Platform.OS === 'ios' ? 'iOS' : 'Android'}
                    </Text>
                </View>

                {/* Informations */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>À propos de ChatMa</Text>
                    <Text style={[styles.description, { color: theme.textSecondary }]}>
                        ChatMa est une application de messagerie et de réseau social qui permet aux utilisateurs 
                        de communiquer, partager des moments et faire du commerce en toute sécurité.
                    </Text>
                </View>

                {/* Liens */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Liens utiles</Text>
                    
                    <TouchableOpacity 
                        style={[styles.linkItem, { backgroundColor: theme.inputBackground }]}
                        onPress={() => handleLinkPress('https://chatma.com')}
                    >
                        <View style={styles.linkLeft}>
                            <Ionicons name="globe-outline" size={22} color={theme.text} />
                            <Text style={[styles.linkText, { color: theme.text }]}>Site web</Text>
                        </View>
                        <Ionicons name="open-outline" size={22} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.linkItem, { backgroundColor: theme.inputBackground }]}
                        onPress={() => handleLinkPress('https://chatma.com/privacy')}
                    >
                        <View style={styles.linkLeft}>
                            <Ionicons name="shield-checkmark-outline" size={22} color={theme.text} />
                            <Text style={[styles.linkText, { color: theme.text }]}>Politique de confidentialité</Text>
                        </View>
                        <Ionicons name="open-outline" size={22} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.linkItem, { backgroundColor: theme.inputBackground }]}
                        onPress={() => handleLinkPress('https://chatma.com/terms')}
                    >
                        <View style={styles.linkLeft}>
                            <Ionicons name="document-text-outline" size={22} color={theme.text} />
                            <Text style={[styles.linkText, { color: theme.text }]}>Conditions d'utilisation</Text>
                        </View>
                        <Ionicons name="open-outline" size={22} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Contact */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact</Text>
                    
                    <TouchableOpacity 
                        style={[styles.linkItem, { backgroundColor: theme.inputBackground }]}
                        onPress={() => handleLinkPress('mailto:support@chatma.com')}
                    >
                        <View style={styles.linkLeft}>
                            <Ionicons name="mail-outline" size={22} color={theme.text} />
                            <Text style={[styles.linkText, { color: theme.text }]}>support@chatma.com</Text>
                        </View>
                        <Ionicons name="open-outline" size={22} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Copyright */}
                <Text style={[styles.copyright, { color: theme.textSecondary }]}>
                    © {new Date().getFullYear()} ChatMa. Tous droits réservés.
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
    logoSection: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    version: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    platform: {
        fontSize: 14,
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
    description: {
        fontSize: 15,
        lineHeight: 22,
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    linkLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    linkText: {
        fontSize: 16,
        marginLeft: 12,
    },
    copyright: {
        textAlign: 'center',
        fontSize: 14,
        paddingVertical: 24,
    },
});

export default AboutScreen;
