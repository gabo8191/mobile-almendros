import { View, StyleSheet, SafeAreaView, Image, Platform } from 'react-native';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/Colors';

export default function LoginScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={{ uri: 'https://images.pexels.com/photos/6214472/pexels-photo-6214472.jpeg' }}
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
        fontFamily: 'System',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitleText: {
        fontFamily: 'System',
        fontSize: 17,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    formContainer: {
        paddingHorizontal: 24,
    },
});