// app/login.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../src/shared/context/AuthContext';
import { AppInput } from '../src/shared/components/AppInput';
import { AppButton } from '../src/shared/components/AppButton';
import { AppLoader } from '../src/shared/components/AppLoader';
import { loginWithDocument, getClientByDocument } from '../src/features/auth/services/authService';
import { colors } from '../src/constants/Colors';

export default function LoginScreen() {
    const { login } = useAuth();
    const [documentNumber, setDocumentNumber] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!documentNumber.trim()) {
            setError('Por favor, ingrese su número de cédula');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // First, get the client by document number
            const clientResponse = await getClientByDocument(documentNumber);

            if (clientResponse && clientResponse.client) {
                // Then, attempt login (in a real implementation, this would be proper authentication)
                const loginResponse = await loginWithDocument(documentNumber);

                // Store token and user data
                await login(loginResponse.token, clientResponse.client);
            } else {
                setError('Cliente no encontrado. Verifique su número de cédula.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('No se pudo iniciar sesión. Por favor, intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {isLoading && <AppLoader message="Iniciando sesión..." />}

            <View style={styles.content}>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logo}
                />

                <Text style={styles.title}>Iniciar Sesión</Text>
                <Text style={styles.subtitle}>
                    Ingrese su número de cédula para ver sus compras
                </Text>

                <View style={styles.form}>
                    <AppInput
                        label="Número de Cédula"
                        placeholder="Ingrese su cédula"
                        keyboardType="number-pad"
                        value={documentNumber}
                        onChangeText={setDocumentNumber}
                        error={error}
                        fullWidth
                    />

                    <AppButton
                        title="Ingresar"
                        onPress={handleLogin}
                        fullWidth
                    />
                </View>

                <Text style={styles.footer}>
                    Almendros © {new Date().getFullYear()}
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 24,
    },
    logo: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        marginBottom: 32,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
        textAlign: 'center',
    },
    form: {
        width: '100%',
        gap: 16,
    },
    footer: {
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: '#999',
        fontSize: 12,
    },
});