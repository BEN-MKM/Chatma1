import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../services/authService';
import { loginSuccess, loginRequest, loginFailure } from '../redux/reducers/authReducer';
import { authTheme } from '../theme';

const { width } = Dimensions.get('window');

const AuthScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // États
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Validation des champs
  const validateEmail = useCallback((email) => {
    if (!email) return 'L\'email est requis';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Format d\'email invalide';
    return '';
  }, []);

  const validatePassword = useCallback((password) => {
    if (!password) return 'Le mot de passe est requis';
    if (password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères';
    if (!/[A-Z]/.test(password)) return 'Le mot de passe doit contenir au moins une majuscule';
    if (!/[a-z]/.test(password)) return 'Le mot de passe doit contenir au moins une minuscule';
    if (!/[0-9]/.test(password)) return 'Le mot de passe doit contenir au moins un chiffre';
    if (!/[!@#$%^&*]/.test(password)) return 'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)';
    return '';
  }, []);

  const validateConfirmPassword = useCallback((confirmPwd) => {
    if (!confirmPwd) return 'La confirmation du mot de passe est requise';
    if (confirmPwd !== password) return 'Les mots de passe ne correspondent pas';
    return '';
  }, [password]);

  const validateUsername = useCallback((username) => {
    if (!username) return 'Le nom d\'utilisateur est requis';
    if (username.length < 3) return 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Le nom d\'utilisateur ne peut contenir que des lettres, des chiffres et des underscores';
    return '';
  }, []);

  const validatePhoneNumber = useCallback((phone) => {
    if (!phone) return 'Le numéro de téléphone est requis';
    if (!/^\+?[1-9]\d{1,14}$/.test(phone)) return 'Format de numéro de téléphone invalide';
    return '';
  }, []);

  const handleSubmit = async () => {
    // Validation
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const usernameErr = !isLogin ? validateUsername(username) : '';
    const confirmPasswordErr = !isLogin ? validateConfirmPassword(confirmPassword) : '';
    const phoneNumberErr = !isLogin ? validatePhoneNumber(phoneNumber) : '';

    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setUsernameError(usernameErr);
    setConfirmPasswordError(confirmPasswordErr);
    setPhoneNumberError(phoneNumberErr);

    if (emailErr || passwordErr || (!isLogin && (usernameErr || confirmPasswordErr || phoneNumberErr))) {
      return;
    }

    if (!isLogin && !acceptedTerms) {
      Alert.alert('Erreur', 'Veuillez accepter les conditions d\'utilisation');
      return;
    }

    try {
      setLoading(true);
      dispatch(loginRequest());

      if (isLogin) {
        const user = await authService.signIn(email, password);
        if (user) {
          dispatch(loginSuccess(user));
          navigation.replace('Main');
        }
      } else {
        await authService.signUp(email, password, username, phoneNumber);
        Alert.alert(
          'Inscription réussie',
          'Votre compte a été créé avec succès. Veuillez vérifier votre email pour activer votre compte.',
          [{ text: 'OK', onPress: () => setIsLogin(true) }]
        );
      }
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      dispatch(loginFailure(error.message));
      Alert.alert(
        'Erreur',
        error.message || 'Une erreur est survenue lors de l\'authentification'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Réinitialiser les erreurs et les champs
    setEmailError('');
    setPasswordError('');
    setUsernameError('');
    setConfirmPasswordError('');
    setPhoneNumberError('');
    setUsername('');
    setConfirmPassword('');
    setPhoneNumber('');
    setAcceptedTerms(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gradientBackground}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerContainer}>
              <View style={styles.logoPlaceholder}>
                <Ionicons name="chatbubbles" size={width * 0.15} color={authTheme.colors.text} />
              </View>
              <Text style={styles.appName}>ChatMa</Text>
              <Text style={styles.welcomeText}>
                {isLogin ? 'Ravi de vous revoir !' : 'Rejoignez la communauté'}
              </Text>
              <Text style={styles.subtitleText}>
                {isLogin ? 'Connectez-vous pour continuer' : 'Créez votre compte en quelques étapes'}
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={[styles.card, styles.form]}>
                {!isLogin && (
                  <View style={styles.inputContainer}>
                    <Ionicons 
                      name="person-outline" 
                      size={24} 
                      color={authTheme.colors.text} 
                      style={styles.inputIcon} 
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Nom d'utilisateur"
                      placeholderTextColor={authTheme.colors.textSecondary}
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                    />
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <Ionicons 
                    name="mail-outline" 
                    size={24} 
                    color={authTheme.colors.text} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={authTheme.colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons 
                    name="lock-closed-outline" 
                    size={24} 
                    color={authTheme.colors.text} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    placeholderTextColor={authTheme.colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity 
                    style={styles.showPasswordButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={24} 
                      color={authTheme.colors.text} 
                    />
                  </TouchableOpacity>
                </View>

                {!isLogin && (
                  <>
                    <View style={styles.inputContainer}>
                      <Ionicons 
                        name="lock-closed-outline" 
                        size={24} 
                        color={authTheme.colors.text} 
                        style={styles.inputIcon} 
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Confirmer le mot de passe"
                        placeholderTextColor={authTheme.colors.textSecondary}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                      />
                      <TouchableOpacity 
                        style={styles.showPasswordButton}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <Ionicons 
                          name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                          size={24} 
                          color={authTheme.colors.text} 
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                      <Ionicons 
                        name="call-outline" 
                        size={24} 
                        color={authTheme.colors.text} 
                        style={styles.inputIcon} 
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Numéro de téléphone"
                        placeholderTextColor={authTheme.colors.textSecondary}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                      />
                    </View>

                    <View style={styles.termsContainer}>
                      <TouchableOpacity 
                        style={styles.checkbox} 
                        onPress={() => setAcceptedTerms(!acceptedTerms)}
                      >
                        <Ionicons 
                          name={acceptedTerms ? "checkbox" : "square-outline"} 
                          size={24} 
                          color={authTheme.colors.text} 
                        />
                      </TouchableOpacity>
                      <Text style={styles.termsText}>
                        J'accepte les conditions d'utilisation
                      </Text>
                    </View>
                  </>
                )}

                <TouchableOpacity
                  style={[
                    styles.mainButton,
                    (!isLogin && (!acceptedTerms || emailError || passwordError || (!isLogin && (usernameError || confirmPasswordError || phoneNumberError)))) && styles.mainButtonDisabled
                  ]}
                  onPress={handleSubmit}
                  disabled={!isLogin && (!acceptedTerms || emailError || passwordError || (!isLogin && (usernameError || confirmPasswordError || phoneNumberError)))}
                >
                  {loading ? (
                    <ActivityIndicator color={authTheme.colors.primary} />
                  ) : (
                    <Text style={styles.mainButtonText}>
                      {isLogin ? 'Se connecter' : "S'inscrire"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              {isLogin && (
                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text style={styles.forgotPasswordText}>
                    Mot de passe oublié ?
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => setIsLogin(!isLogin)}
              >
                <Text style={styles.switchButtonText}>
                  {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: authTheme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: authTheme.spacing.md,
    paddingBottom: authTheme.spacing.xl,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: authTheme.spacing.xl,
    marginBottom: authTheme.spacing.xl,
  },
  logoPlaceholder: {
    width: width * 0.3,
    height: width * 0.3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: authTheme.spacing.md,
  },
  appName: {
    ...authTheme.typography.h1,
    fontSize: 32,
    color: authTheme.colors.text,
    fontWeight: 'bold',
    marginBottom: authTheme.spacing.sm,
  },
  welcomeText: {
    ...authTheme.typography.h1,
    color: authTheme.colors.text,
    textAlign: 'center',
    marginBottom: authTheme.spacing.xs,
  },
  subtitleText: {
    ...authTheme.typography.body,
    color: authTheme.colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  card: {
    backgroundColor: authTheme.colors.surface,
    borderRadius: authTheme.borderRadius.large,
    padding: authTheme.spacing.lg,
    marginBottom: authTheme.spacing.md,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: authTheme.borderRadius.medium,
    marginBottom: authTheme.spacing.md,
    paddingHorizontal: authTheme.spacing.md,
    height: 56,
  },
  inputIcon: {
    marginRight: authTheme.spacing.sm,
  },
  input: {
    flex: 1,
    color: authTheme.colors.text,
    ...authTheme.typography.body,
  },
  showPasswordButton: {
    padding: authTheme.spacing.sm,
  },
  checkbox: {
    marginRight: authTheme.spacing.sm,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: authTheme.spacing.md,
  },
  termsText: {
    flex: 1,
    color: authTheme.colors.text,
    ...authTheme.typography.caption,
  },
  mainButton: {
    backgroundColor: authTheme.colors.text,
    borderRadius: authTheme.borderRadius.medium,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: authTheme.spacing.md,
  },
  mainButtonDisabled: {
    opacity: 0.7,
  },
  mainButtonText: {
    color: authTheme.colors.primary,
    ...authTheme.typography.h1,
    fontSize: 18,
  },
  switchButton: {
    marginTop: authTheme.spacing.md,
    alignItems: 'center',
  },
  switchButtonText: {
    color: authTheme.colors.text,
    ...authTheme.typography.body,
  },
  forgotPasswordButton: {
    marginTop: authTheme.spacing.md,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: authTheme.colors.text,
    ...authTheme.typography.caption,
    textDecorationLine: 'underline',
  },
});

export default AuthScreen;
