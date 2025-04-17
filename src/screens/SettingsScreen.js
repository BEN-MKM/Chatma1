import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    Switch,
    Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../config/supabase';

const SettingsScreen = ({ navigation }) => {
    const { theme, toggleTheme, isDark } = useTheme();
    const { user } = useAuth();
    const [notifications, setNotifications] = React.useState(true);
    const [emailNotifs, setEmailNotifs] = React.useState(true);
    const [privateAccount, setPrivateAccount] = React.useState(false);

    const handleLogout = async () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel'
                },
                {
                    text: 'Déconnecter',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { error } = await supabase.auth.signOut();
                            if (error) throw error;
                        } catch (error) {
                            Alert.alert('Erreur', error.message);
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Supprimer le compte',
            'Cette action est irréversible. Toutes vos données seront supprimées définitivement. Voulez-vous continuer ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel'
                },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('profiles')
                                .delete()
                                .eq('id', user.id);

                            if (error) throw error;

                            await supabase.auth.signOut();
                        } catch (error) {
                            Alert.alert('Erreur', error.message);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Paramètres</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView>
                {/* Compte */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Profil et sécurité</Text>
                    
                    <TouchableOpacity 
                        style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <View style={styles.settingLeft}>
                            <Ionicons name="person-circle-outline" size={22} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Informations du profil</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <View style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="lock-closed-outline" size={22} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Compte privé</Text>
                        </View>
                        <Switch
                            value={privateAccount}
                            onValueChange={setPrivateAccount}
                            trackColor={{ false: '#767577', true: theme.primary }}
                            thumbColor={privateAccount ? '#fff' : '#f4f3f4'}
                        />
                    </View>
                </View>

                {/* Apparence */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Apparence</Text>

                    <View style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="moon-outline" size={22} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Thème sombre</Text>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#767577', true: theme.primary }}
                            thumbColor={isDark ? '#fff' : '#f4f3f4'}
                        />
                    </View>
                </View>

                {/* Notifications */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>

                    <View style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="notifications-outline" size={22} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Notifications push</Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: '#767577', true: theme.primary }}
                            thumbColor={notifications ? '#fff' : '#f4f3f4'}
                        />
                    </View>

                    <View style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="mail-outline" size={22} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Notifications par email</Text>
                        </View>
                        <Switch
                            value={emailNotifs}
                            onValueChange={setEmailNotifs}
                            trackColor={{ false: '#767577', true: theme.primary }}
                            thumbColor={emailNotifs ? '#fff' : '#f4f3f4'}
                        />
                    </View>
                </View>

                {/* Aide et Informations */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Aide et Informations</Text>

                    <TouchableOpacity 
                        style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}
                        onPress={() => navigation.navigate('Help')}
                    >
                        <View style={styles.settingLeft}>
                            <Ionicons name="help-circle-outline" size={22} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Centre d'aide</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}
                        onPress={() => navigation.navigate('About')}
                    >
                        <View style={styles.settingLeft}>
                            <Ionicons name="information-circle-outline" size={22} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>À propos de ChatMa</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Actions du compte */}
                <View style={[styles.section, styles.dangerSection]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Actions du compte</Text>

                    <TouchableOpacity 
                        style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}
                        onPress={handleLogout}
                    >
                        <View style={styles.settingLeft}>
                            <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
                            <Text style={[styles.settingText, { color: '#FF3B30' }]}>Se déconnecter</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.settingItem, { backgroundColor: theme.inputBackground }]}
                        onPress={handleDeleteAccount}
                    >
                        <View style={styles.settingLeft}>
                            <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                            <Text style={[styles.settingText, { color: '#FF3B30' }]}>Supprimer mon compte</Text>
                        </View>
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
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    dangerSection: {
        marginTop: 32,
        paddingTop: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#FF3B30',
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 16,
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
        flex: 1,
    },
    settingText: {
        fontSize: 16,
        marginLeft: 12,
        flex: 1,
    },
});

export default SettingsScreen;
