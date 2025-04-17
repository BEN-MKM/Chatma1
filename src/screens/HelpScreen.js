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

const FAQItem = ({ question, answer, theme, isOpen, onToggle }) => {
    return (
        <View style={[styles.faqItem, { backgroundColor: theme.inputBackground }]}>
            <TouchableOpacity 
                style={styles.faqHeader} 
                onPress={onToggle}
            >
                <Text style={[styles.faqQuestion, { color: theme.text }]}>{question}</Text>
                <Ionicons 
                    name={isOpen ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    color={theme.text} 
                />
            </TouchableOpacity>
            {isOpen && (
                <Text style={[styles.faqAnswer, { color: theme.textSecondary }]}>
                    {answer}
                </Text>
            )}
        </View>
    );
};

const HelpScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFaq, setSelectedFaq] = useState(null);
    const [supportMessage, setSupportMessage] = useState('');

    const faqData = [
        {
            id: 1,
            question: "Comment modifier mon profil ?",
            answer: "Pour modifier votre profil, allez dans l'onglet Profil, puis appuyez sur le bouton 'Modifier le profil'. Vous pourrez y modifier votre photo de profil, votre nom, votre bio et d'autres informations."
        },
        {
            id: 2,
            question: "Comment envoyer un message ?",
            answer: "Pour envoyer un message, allez dans l'onglet Messages, appuyez sur l'icône '+' ou 'Nouveau message', sélectionnez un contact et commencez à écrire votre message."
        },
        {
            id: 3,
            question: "Comment publier du contenu ?",
            answer: "Pour publier du contenu, allez dans l'onglet Feed et appuyez sur le bouton '+' en bas. Vous pourrez choisir de publier une photo, une vidéo ou du texte."
        },
        {
            id: 4,
            question: "Comment gérer mes paramètres de confidentialité ?",
            answer: "Accédez aux paramètres de confidentialité en allant dans votre profil, puis dans 'Paramètres' > 'Confidentialité'. Vous pourrez y gérer qui peut voir votre profil, vos publications et vous contacter."
        },
        {
            id: 5,
            question: "Comment bloquer un utilisateur ?",
            answer: "Pour bloquer un utilisateur, allez sur son profil, appuyez sur les trois points en haut à droite et sélectionnez 'Bloquer'. Vous pouvez gérer vos utilisateurs bloqués dans Paramètres > Confidentialité > Utilisateurs bloqués."
        }
    ];

    const filteredFaqs = faqData.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendSupport = async () => {
        if (!supportMessage.trim()) {
            Alert.alert('Erreur', 'Veuillez écrire votre message');
            return;
        }

        try {
            setLoading(true);
            
            const { error } = await supabase
                .from('support_tickets')
                .insert({
                    user_id: user.id,
                    message: supportMessage,
                    status: 'pending'
                });

            if (error) throw error;

            Alert.alert(
                'Succès',
                'Votre message a été envoyé avec succès. Notre équipe vous répondra dans les plus brefs délais.',
                [{ text: 'OK', onPress: () => setSupportMessage('') }]
            );

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
                <Text style={[styles.headerTitle, { color: theme.text }]}>Centre d'aide</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Recherche */}
                <View style={styles.searchSection}>
                    <View style={[styles.searchBar, { backgroundColor: theme.inputBackground }]}>
                        <Ionicons name="search" size={20} color={theme.textSecondary} />
                        <TextInput
                            style={[styles.searchInput, { color: theme.text }]}
                            placeholder="Rechercher dans l'aide..."
                            placeholderTextColor={theme.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery ? (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close" size={20} color={theme.textSecondary} />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>

                {/* FAQ */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Questions fréquentes</Text>
                    {filteredFaqs.map((faq) => (
                        <FAQItem
                            key={faq.id}
                            question={faq.question}
                            answer={faq.answer}
                            theme={theme}
                            isOpen={selectedFaq === faq.id}
                            onToggle={() => setSelectedFaq(selectedFaq === faq.id ? null : faq.id)}
                        />
                    ))}
                </View>

                {/* Support */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Contacter le support</Text>
                    <View style={[styles.supportCard, { backgroundColor: theme.inputBackground }]}>
                        <TextInput
                            style={[styles.supportInput, { 
                                color: theme.text,
                                backgroundColor: theme.background,
                                borderColor: theme.border
                            }]}
                            placeholder="Décrivez votre problème..."
                            placeholderTextColor={theme.textSecondary}
                            multiline
                            numberOfLines={4}
                            value={supportMessage}
                            onChangeText={setSupportMessage}
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, { backgroundColor: theme.primary }]}
                            onPress={handleSendSupport}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.sendButtonText}>Envoyer</Text>
                            )}
                        </TouchableOpacity>
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
    searchSection: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 44,
        borderRadius: 22,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
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
    faqItem: {
        borderRadius: 12,
        marginBottom: 8,
        overflow: 'hidden',
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    faqQuestion: {
        flex: 1,
        fontSize: 16,
        marginRight: 16,
    },
    faqAnswer: {
        fontSize: 15,
        lineHeight: 22,
        padding: 16,
        paddingTop: 0,
    },
    supportCard: {
        borderRadius: 12,
        padding: 16,
    },
    supportInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    sendButton: {
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    sendButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default HelpScreen;
