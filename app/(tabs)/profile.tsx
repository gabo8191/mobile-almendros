import { View, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { colors } from '@/constants/Colors';
import { LogOut, User } from 'lucide-react-native';

export default function ProfileScreen() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Está seguro que desea cerrar su sesión?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Cerrar Sesión",
                    onPress: () => logout(),
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <ThemedText style={styles.title}>Mi Perfil</ThemedText>
            </View>

            <View style={styles.content}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <User size={40} color="#fff" />
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <ThemedText style={styles.name}>{user?.name || 'Usuario'}</ThemedText>
                    <ThemedText style={styles.cedula}>Cédula: {user?.cedula || '0000000000'}</ThemedText>
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                >
                    <LogOut size={20} color="#fff" />
                    <ThemedText style={styles.logoutText}>Cerrar Sesión</ThemedText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 12 : 56,
        paddingBottom: 8,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    title: {
        fontFamily: 'SF-Pro-Display-Bold',
        fontSize: 34,
        marginLeft: 4,
    },
    content: {
        padding: 24,
        alignItems: 'center',
    },
    avatarContainer: {
        marginVertical: 24,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    name: {
        fontFamily: 'SF-Pro-Display-Bold',
        fontSize: 24,
        marginBottom: 8,
    },
    cedula: {
        fontFamily: 'SF-Pro-Text-Regular',
        fontSize: 16,
        color: colors.textSecondary,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '100%',
        marginTop: 16,
    },
    logoutText: {
        color: '#fff',
        fontFamily: 'SF-Pro-Text-Medium',
        fontSize: 16,
        marginLeft: 8,
    },
});