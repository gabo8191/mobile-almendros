// app/(tabs)/profile.tsx
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { colors } from '@/constants/Colors';
import { LogOut, User, Mail, Phone, MapPin } from 'lucide-react-native';

export default function ProfileScreen() {
    const { user, logout, loading } = useAuth();

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
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <User size={20} color={colors.textSecondary} style={styles.infoIcon} />
                            <ThemedText style={styles.infoLabel}>Cédula:</ThemedText>
                            <ThemedText style={styles.infoValue}>{user?.cedula || 'No disponible'}</ThemedText>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <Mail size={20} color={colors.textSecondary} style={styles.infoIcon} />
                            <ThemedText style={styles.infoLabel}>Email:</ThemedText>
                            <ThemedText style={styles.infoValue}>{user?.email || 'No disponible'}</ThemedText>
                        </View>

                        {user?.phone && (
                            <>
                                <View style={styles.divider} />
                                <View style={styles.infoRow}>
                                    <Phone size={20} color={colors.textSecondary} style={styles.infoIcon} />
                                    <ThemedText style={styles.infoLabel}>Teléfono:</ThemedText>
                                    <ThemedText style={styles.infoValue}>{user.phone}</ThemedText>
                                </View>
                            </>
                        )}

                        {user?.address && (
                            <>
                                <View style={styles.divider} />
                                <View style={styles.infoRow}>
                                    <MapPin size={20} color={colors.textSecondary} style={styles.infoIcon} />
                                    <ThemedText style={styles.infoLabel}>Dirección:</ThemedText>
                                    <ThemedText style={styles.infoValue}>{user.address}</ThemedText>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <LogOut size={20} color="#fff" />
                            <ThemedText style={styles.logoutText}>Cerrar Sesión</ThemedText>
                        </>
                    )}
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
        width: '100%',
        marginBottom: 32,
    },
    name: {
        fontFamily: 'SF-Pro-Display-Bold',
        fontSize: 24,
        marginBottom: 24,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: '100%',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    infoIcon: {
        marginRight: 12,
    },
    infoLabel: {
        fontFamily: 'SF-Pro-Text-Medium',
        fontSize: 16,
        width: 80,
        color: colors.textSecondary,
    },
    infoValue: {
        fontFamily: 'SF-Pro-Text-Regular',
        fontSize: 16,
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        width: '100%',
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