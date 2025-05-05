import { View, StyleSheet, SafeAreaView, Image, Platform } from 'react-native';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/Colors';

export default function LoginScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.headerContainer}>
                <ThemedText style={styles.welcomeText}>Bienvenido a Almendros</ThemedText>
                <ThemedText style={styles.subtitleText}>
                    Sistema Integral de Gestión de Mercancía de Almendros (SIGMA)
                </ThemedText>
            </View>

            <View style={styles.formContainer}>
                <LoginForm />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 80 : 60,
        marginBottom: 30,
    },
    logoImage: {
        width: 120,
        height: 120,
        borderRadius: 12,
    },
    headerContainer: {
        paddingHorizontal: 24,
        marginBottom: 40,
    },
    welcomeText: {
        fontFamily: 'System',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitleText: {
        fontFamily: 'System',
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    formContainer: {
        paddingHorizontal: 24,
    },
});