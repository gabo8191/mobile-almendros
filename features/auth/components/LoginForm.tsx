import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/Colors';

export function LoginForm() {
    const [cedula, setCedula] = useState('');
    const [password, setPassword] = useState('');
    const [cedulaError, setCedulaError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { login, loading, error } = useAuth();

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
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Input
                    label="Cédula"
                    value={cedula}
                    onChangeText={setCedula}
                    placeholder="Ingrese su cédula"
                    keyboardType="numeric"
                    maxLength={10}
                    error={cedulaError}
                />

                <Input
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

                <Button
                    title="Iniciar Sesión"
                    onPress={handleLogin}
                    loading={loading}
                    fullWidth
                    style={styles.loginButton}
                />

                <TouchableOpacity style={styles.forgotPassword}>
                    <ThemedText style={styles.forgotPasswordText}>
                        ¿Olvidaste tu contraseña?
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    formContainer: {
        width: '100%',
    },
    errorContainer: {
        padding: 12,
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        borderRadius: 8,
        marginBottom: 20,
    },
    errorText: {
        fontFamily: 'System',
        fontSize: 14,
        color: colors.error,
        textAlign: 'center',
    },
    loginButton: {
        marginTop: 10,
    },
    forgotPassword: {
        marginTop: 16,
        alignItems: 'center',
    },
    forgotPasswordText: {
        fontFamily: 'System',
        fontSize: 15,
        color: colors.primary,
    },
});