import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../config/supabase';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';

const TwoFactorScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [is2FAEnabled, set2FAEnabled] = useState(false);
    const [qrCodeData, setQRCodeData] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    useEffect(() => {
        check2FAStatus();
    }, [check2FAStatus]);

    const check2FAStatus = React.useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('two_factor_enabled')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            set2FAEnabled(data.two_factor_enabled || false);
        } catch (error) {
            Alert.alert('Erreur', error.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const generateQRCode = async () => {
        try {
            setGenerating(true);
            const { data, error } = await supabase.functions.invoke('generate-2fa-secret', {
                body: { user_id: user.id }
            });

            if (error) throw error;

            setQRCodeData(data.qr_code_url);
            setSecretKey(data.secret);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de générer le code QR');
        } finally {
            setGenerating(false);
        }
    };

    const verifyAndEnable2FA = async () => {
        if (!verificationCode.trim()) {
            Alert.alert('Erreur', 'Veuillez entrer le code de vérification');
            return;
        }

        try {
            setVerifying(true);
            const { data, error } = await supabase.functions.invoke('verify-2fa-token', {
                body: { 
                    user_id: user.id,
                    token: verificationCode,
                    secret: secretKey
                }
            });

            if (error) throw error;

            if (data.valid) {
                // Mettre à jour le profil
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ 
                        two_factor_enabled: true,
                        two_factor_secret: secretKey
                    })
                    .eq('id', user.id);

                if (updateError) throw updateError;

                set2FAEnabled(true);
                setQRCodeData('');
                setSecretKey('');
                setVerificationCode('');
                Alert.alert('Succès', 'L\'authentification à deux facteurs a été activée');
            } else {
                Alert.alert('Erreur', 'Code de vérification invalide');
            }
        } catch (error) {
            Alert.alert('Erreur', error.message);
        } finally {
            setVerifying(false);
        }
    };

    const disable2FA = () => {
        Alert.alert(
            'Désactiver l\'A2F',
            'Êtes-vous sûr de vouloir désactiver l\'authentification à deux facteurs ? Cela réduira la sécurité de votre compte.',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Désactiver',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const { error } = await supabase
                                .from('profiles')
                                .update({ 
                                    two_factor_enabled: false,
                                    two_factor_secret: null
                                })
                                .eq('id', user.id);

                            if (error) throw error;

                            set2FAEnabled(false);
                            Alert.alert('Succès', 'L\'authentification à deux facteurs a été désactivée');
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

    const copySecretKey = async () => {
        try {
            await Clipboard.setStringAsync(secretKey);
            Alert.alert('Succès', 'Clé secrète copiée dans le presse-papiers');
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de copier la clé');
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                    Authentification à deux facteurs
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* État actuel */}
                <View style={styles.section}>
                    <View style={[styles.statusCard, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.statusHeader}>
                            <Ionicons 
                                name={is2FAEnabled ? "shield-checkmark" : "shield-outline"} 
                                size={24} 
                                color={is2FAEnabled ? theme.primary : theme.textSecondary} 
                            />
                            <View style={styles.statusInfo}>
                                <Text style={[styles.statusTitle, { color: theme.text }]}>
                                    {is2FAEnabled ? 'A2F activée' : 'A2F désactivée'}
                                </Text>
                                <Text style={[styles.statusDescription, { color: theme.textSecondary }]}>
                                    {is2FAEnabled 
                                        ? 'Votre compte est protégé par l\'authentification à deux facteurs'
                                        : 'Activez l\'A2F pour une sécurité renforcée'
                                    }
                                </Text>
                            </View>
                        </View>
                        
                        {is2FAEnabled ? (
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: '#FF3B30' }]}
                                onPress={disable2FA}
                            >
                                <Text style={styles.buttonText}>Désactiver</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: theme.primary }]}
                                onPress={generateQRCode}
                                disabled={generating}
                            >
                                {generating ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.buttonText}>Activer</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Configuration */}
                {qrCodeData && !is2FAEnabled && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Configuration</Text>
                        
                        <View style={[styles.configCard, { backgroundColor: theme.inputBackground }]}>
                            <Text style={[styles.configText, { color: theme.text }]}>
                                1. Scannez ce QR code avec votre application d'authentification
                            </Text>
                            
                            <View style={[styles.qrContainer, { backgroundColor: 'white' }]}>
                                <QRCode
                                    value={qrCodeData}
                                    size={200}
                                />
                            </View>

                            <Text style={[styles.configText, { color: theme.text }]}>
                                2. Ou copiez cette clé secrète dans votre application
                            </Text>
                            
                            <TouchableOpacity
                                style={[styles.secretKeyContainer, { backgroundColor: theme.background }]}
                                onPress={copySecretKey}
                            >
                                <Text style={[styles.secretKey, { color: theme.text }]}>
                                    {secretKey}
                                </Text>
                                <Ionicons name="copy-outline" size={20} color={theme.textSecondary} />
                            </TouchableOpacity>

                            <Text style={[styles.configText, { color: theme.text }]}>
                                3. Entrez le code généré par votre application
                            </Text>

                            <TextInput
                                style={[styles.input, { 
                                    color: theme.text,
                                    backgroundColor: theme.background,
                                    borderColor: theme.border
                                }]}
                                value={verificationCode}
                                onChangeText={setVerificationCode}
                                placeholder="Code à 6 chiffres"
                                placeholderTextColor={theme.textSecondary}
                                keyboardType="number-pad"
                                maxLength={6}
                            />

                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: theme.primary }]}
                                onPress={verifyAndEnable2FA}
                                disabled={verifying}
                            >
                                {verifying ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.buttonText}>Vérifier et activer</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Informations */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>À propos de l'A2F</Text>
                    <View style={[styles.infoCard, { backgroundColor: theme.inputBackground }]}>
                        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                            L'authentification à deux facteurs (A2F) ajoute une couche de sécurité supplémentaire 
                            à votre compte. En plus de votre mot de passe, vous devrez entrer un code unique 
                            généré par votre application d'authentification à chaque connexion.
                        </Text>
                        <Text style={[styles.infoText, { color: theme.textSecondary, marginTop: 12 }]}>
                            Applications d'authentification recommandées :
                        </Text>
                        <Text style={[styles.infoList, { color: theme.textSecondary }]}>
                            • Google Authenticator{'\n'}
                            • Microsoft Authenticator{'\n'}
                            • Authy
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
    statusCard: {
        borderRadius: 12,
        padding: 16,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusInfo: {
        marginLeft: 12,
        flex: 1,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    statusDescription: {
        fontSize: 14,
    },
    configCard: {
        borderRadius: 12,
        padding: 16,
    },
    configText: {
        fontSize: 15,
        marginBottom: 16,
    },
    qrContainer: {
        alignSelf: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    secretKeyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    secretKey: {
        fontSize: 16,
        fontFamily: 'monospace',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 16,
    },
    button: {
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    infoCard: {
        borderRadius: 12,
        padding: 16,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 20,
    },
    infoList: {
        fontSize: 14,
        lineHeight: 24,
        marginTop: 8,
    },
});

export default TwoFactorScreen;
