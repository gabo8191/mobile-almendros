import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Image,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    StatusBar,
} from 'react-native';
import { ThemedText } from '../../src/shared/components/ThemedText';
import { AppLoader } from '../../src/shared/components/AppLoader';
import { colors } from '../../src/constants/Colors';
import { useAuth } from '../../src/shared/context/AuthContext';
import { Feather } from '@expo/vector-icons';
import { typography } from '../../src/constants/Typography';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const { login, isLoading, error } = useAuth();

    const validateForm = () => {
        let isValid = true;

        // Reset errors
        setEmailError('');
        setPasswordError('');

        // Validate email
        if (!email.trim()) {
            setEmailError('El email es requerido');
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            setEmailError('Formato de email inválido');
            isValid = false;
        }

        // Validate password
        if (!password.trim()) {
            setPasswordError('La contraseña es requerida');
            isValid = false;
        }

        return isValid;
    };

    const handleLogin = async () => {
        Keyboard.dismiss();

        if (validateForm()) {
            await login(email, password);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={styles.container}>
                    <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                        <ThemedText style={styles.logoText} type="title">
                            Almendros
                        </ThemedText>
                    </View>

                    <View style={styles.headerContainer}>
                        <ThemedText style={styles.welcomeText} type="subtitle">
                            Bienvenido
                        </ThemedText>
                        <ThemedText style={styles.subtitleText} type="heading">
                            Inicie sesión para ver sus pedidos
                        </ThemedText>
                    </View>

                    <View style={styles.formContainer}>
                        {/* Input de Email */}
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <Feather name="mail" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Ingrese su email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholderTextColor={colors.textTertiary}
                                />
                            </View>
                            {emailError ? (
                                <ThemedText style={styles.errorText}>{emailError}</ThemedText>
                            ) : null}
                        </View>

                        {/* Input de Contraseña */}
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <Feather name="lock" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Ingrese su contraseña"
                                    secureTextEntry={!passwordVisible}
                                    placeholderTextColor={colors.textTertiary}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                >
                                    <Feather
                                        name={passwordVisible ? "eye-off" : "eye"}
                                        size={20}
                                        color={colors.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>
                            {passwordError ? (
                                <ThemedText style={styles.errorText}>{passwordError}</ThemedText>
                            ) : null}
                        </View>

                        {error && (
                            <View style={styles.errorContainer}>
                                <ThemedText style={styles.errorText}>{error}</ThemedText>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            <ThemedText style={styles.buttonText} type="button">
                                Iniciar Sesión
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.forgotPassword}>
                            <ThemedText style={styles.forgotPasswordText} type="caption">
                                ¿Olvidó su contraseña?
                            </ThemedText>
                        </TouchableOpacity>
                    </View>

                    {isLoading && <AppLoader />}
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 60 : 40,
        marginBottom: 20,
    },
    logoImage: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: colors.backgroundAlt,
        padding: 15,
    },
    logoText: {
        marginTop: 12,
        fontSize: typography.sizes.h1,
        color: colors.primaryDark,
        fontFamily: typography.fontFamily.serif,
    },
    headerContainer: {
        paddingHorizontal: 32,
        marginBottom: 30,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: typography.sizes.h3,
        color: colors.primary,
        marginBottom: 8,
        fontFamily: typography.fontFamily.sans,
    },
    subtitleText: {
        fontSize: typography.sizes.body,
        color: colors.textSecondary,
        textAlign: 'center',
        fontFamily: typography.fontFamily.sansLight,
    },
    formContainer: {
        paddingHorizontal: 32,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: colors.text,
        fontSize: typography.sizes.body,
        fontFamily: typography.fontFamily.sans,
        height: '100%',
    },
    eyeIcon: {
        padding: 8,
    },
    errorContainer: {
        padding: 16,
        backgroundColor: 'rgba(211, 47, 47, 0.08)',
        borderRadius: 12,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: colors.error,
    },
    errorText: {
        color: colors.error,
        marginTop: 6,
        fontSize: typography.sizes.small,
        fontFamily: typography.fontFamily.sans,
    },
    loginButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
        elevation: 2,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonText: {
        color: colors.textLight,
        fontSize: typography.sizes.button,
        fontFamily: typography.fontFamily.sansBold,
    },
    forgotPassword: {
        marginTop: 24,
        alignItems: 'center',
    },
    forgotPasswordText: {
        fontSize: typography.sizes.caption,
        color: colors.primary,
        fontFamily: typography.fontFamily.sans,
    },
});