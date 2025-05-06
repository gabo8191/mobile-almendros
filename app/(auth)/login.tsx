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
    TextStyle
} from 'react-native';
import { ThemedText } from '../../src/shared/components/ThemedText';
import { AppLoader } from '../../src/shared/components/AppLoader';
import { colors } from '../../src/constants/Colors';
import { useAuth } from '../../src/shared/context/AuthContext';
import { Feather } from '@expo/vector-icons';
import { typography } from '../../src/constants/Typography';

export default function LoginScreen() {
    const [cedula, setCedula] = useState('');
    const [password, setPassword] = useState('');
    const [cedulaError, setCedulaError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

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
                    <ThemedText style={styles.logoText} type="title">
                        Almendros
                    </ThemedText>
                </View>

                <View style={styles.headerContainer}>
                    <ThemedText style={styles.subtitleText} type="heading">
                        Inicie sesión para ver sus pedidos
                    </ThemedText>
                </View>

                <View style={styles.formContainer}>
                    {/* Input de Cédula */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={cedula}
                            onChangeText={setCedula}
                            placeholder="Ingrese su cédula"
                            keyboardType="numeric"
                            maxLength={10}
                            placeholderTextColor="#999"
                        />
                        {cedulaError ? (
                            <ThemedText style={styles.errorText}>{cedulaError}</ThemedText>
                        ) : null}
                    </View>

                    {/* Input de Contraseña */}
                    <View style={styles.inputContainer}>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Ingrese su contraseña"
                                secureTextEntry={!passwordVisible}
                                placeholderTextColor="#999"
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setPasswordVisible(!passwordVisible)}
                            >
                                <Feather
                                    name={passwordVisible ? "eye-off" : "eye"}
                                    size={20}
                                    color="#666"
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
        marginBottom: 30,
    },
    logoImage: {
        width: 60,
        height: 60,
    },
    logoText: {
        marginTop: 10,
        fontSize: 32,
        textAlign: 'center',
    },
    headerContainer: {
        paddingHorizontal: 24,
        marginBottom: 40,
    },
    subtitleText: {
        textAlign: 'center',
    },
    formContainer: {
        paddingHorizontal: 24,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: 'normal' as TextStyle['fontWeight'],
        fontSize: typography.sizes.body,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        paddingHorizontal: 16,
        color: '#333',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
    },
    errorContainer: {
        padding: 12,
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        borderRadius: 8,
        marginBottom: 20,
    },
    errorText: {
        color: colors.error,
        marginTop: 6,
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#228B22',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    forgotPassword: {
        marginTop: 24,
        alignItems: 'center',
    },
    forgotPasswordText: {
        fontSize: 14,
    },
});