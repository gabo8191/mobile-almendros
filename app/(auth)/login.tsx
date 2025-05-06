import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Image, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ThemedText } from '../../src/shared/components/ThemedText';
import { AppInput } from '../../src/shared/components/AppInput';
import { AppButton } from '../../src/shared/components/AppButton';
import { AppLoader } from '../../src/shared/components/AppLoader';
import { colors } from '../../src/constants/Colors';
import { useAuth } from '../../src/shared/context/AuthContext';

export default function LoginScreen() {
    const [cedula, setCedula] = useState('');
    const [password, setPassword] = useState('');
    const [cedulaError, setCedulaError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { login, isLoading, error } = useAuth();

    const validateForm = () => {
        let isValid = true;

        // Reset errors
        setCedulaError('');
        setPasswordError('');

        // Validate cedula
        if (!cedula.trim()) {
            setCedulaError('La cédula es requerida');
            isValid = false;
        } else if (!/^\d+$/.test(cedula)) {
            setCedulaError('La cédula debe contener solo números');
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
            await login(cedula, password);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.headerContainer}>
                    <ThemedText style={styles.welcomeText}>Bienvenido</ThemedText>
                    <ThemedText style={styles.subtitleText}>
                        Inicie sesión para ver sus pedidos
                    </ThemedText>
                </View>

                <View style={styles.formContainer}>
                    <AppInput
                        label="Cédula"
                        value={cedula}
                        onChangeText={setCedula}
                        placeholder="Ingrese su cédula"
                        keyboardType="numeric"
                        maxLength={10}
                        error={cedulaError}
                    />

                    <AppInput
                        label="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Ingrese su contraseña"
                        secureTextEntry
                        error={passwordError}
                    />

                    {error && (
                        <View style={styles.errorContainer}>
                            <ThemedText style={styles.errorText}>{error}</ThemedText>
                        </View>
                    )}

                    <AppButton
                        title="Iniciar Sesión"
                        onPress={handleLogin}
                        disabled={isLoading}
                    />

                    <TouchableOpacity style={styles.forgotPassword}>
                        <ThemedText style={styles.forgotPasswordText}>
                            ¿Olvidó su contraseña?
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {isLoading && <AppLoader />}
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 60 : 40,
        marginBottom: 20,
    },
    logoImage: {
        width: 120,
        height: 120,
        borderRadius: 20,
    },
    headerContainer: {
        paddingHorizontal: 24,
        marginBottom: 40,
    },
    welcomeText: {
        fontFamily: 'SF-Pro-Display-Bold',
        fontSize: 32,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitleText: {
        fontFamily: 'SF-Pro-Text-Regular',
        fontSize: 17,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    formContainer: {
        paddingHorizontal: 24,
    },
    errorContainer: {
        padding: 12,
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        borderRadius: 8,
        marginBottom: 20,
    },
    errorText: {
        fontFamily: 'SF-Pro-Text-Regular',
        fontSize: 14,
        color: colors.error,
        textAlign: 'center',
    },
    forgotPassword: {
        marginTop: 16,
        alignItems: 'center',
    },
    forgotPasswordText: {
        fontFamily: 'SF-Pro-Text-Regular',
        fontSize: 15,
        color: colors.primary,
    },
});