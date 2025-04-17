import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../config/supabase';

const SecurityScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Erreur', 'Les nouveaux mots de passe ne correspondent pas');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Erreur', 'Le nouveau mot de passe doit contenir au moins 6 caractères');
            return;
        }

        try {
            setLoading(true);

            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            Alert.alert('Succès', 'Votre mot de passe a été modifié avec succès');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
        } catch (error) {
            Alert.alert('Erreur', error.message);
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>Sécurité</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Changer le mot de passe</Text>
                    
                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: theme.text }]}>Mot de passe actuel</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: theme.inputBackground }]}>
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry={!showCurrentPassword}
                                placeholder="Entrez votre mot de passe actuel"
                                placeholderTextColor={theme.textSecondary}
                            />
                            <TouchableOpacity
                                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                                    size={24}
                                    color={theme.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: theme.text }]}>Nouveau mot de passe</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: theme.inputBackground }]}>
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNewPassword}
                                placeholder="Entrez votre nouveau mot de passe"
                                placeholderTextColor={theme.textSecondary}
                            />
                            <TouchableOpacity
                                onPress={() => setShowNewPassword(!showNewPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                                    size={24}
                                    color={theme.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: theme.text }]}>Confirmer le mot de passe</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: theme.inputBackground }]}>
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                placeholder="Confirmez votre nouveau mot de passe"
                                placeholderTextColor={theme.textSecondary}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                    size={24}
                                    color={theme.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary }]}
                        onPress={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Modifier le mot de passe</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Authentification à deux facteurs</Text>
                    <TouchableOpacity 
                        style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}
                        onPress={() => navigation.navigate('TwoFactor')}
                    >
                        <View style={styles.settingLeft}>
                            <Ionicons name="shield-checkmark-outline" size={22} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Configurer l'A2F</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Sessions actives</Text>
                    <TouchableOpacity 
                        style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}
                        onPress={() => navigation.navigate('Sessions')}
                    >
                        <View style={styles.settingLeft}>
                            <Ionicons name="phone-portrait-outline" size={22} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Gérer les appareils</Text>
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
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 8,
    },
    button: {
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
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

export default SecurityScreen;
