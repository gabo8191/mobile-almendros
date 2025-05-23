import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Platform, ScrollView, StatusBar } from 'react-native';
import { ThemedText } from '../../src/shared/components/ThemedText';
import { useAuth } from '../../src/shared/context/AuthContext';
import { colors } from '../../src/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { typography } from '../../src/constants/Typography';

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    // En web, usar window.confirm en lugar de Alert.alert
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('¿Está seguro que desea cerrar su sesión?');
      if (confirmed) {
        performLogout();
      }
    } else {
      // En móvil, usar Alert.alert
      Alert.alert('Cerrar Sesión', '¿Está seguro que desea cerrar su sesión?', [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          onPress: performLogout,
          style: 'destructive',
        },
      ]);
    }
  };

  const performLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      if (Platform.OS === 'web') {
        alert('Error: No se pudo cerrar la sesión correctamente');
      } else {
        Alert.alert('Error', 'No se pudo cerrar la sesión correctamente');
      }
    }
  };

  const menuItems: {
    icon: 'user' | 'map-pin' | 'credit-card' | 'bell' | 'help-circle';
    title: string;
    subtitle: string;
    action: () => void;
  }[] = [
    {
      icon: 'user',
      title: 'Información Personal',
      subtitle: 'Actualice sus datos personales',
      action: () => console.log('Información Personal'),
    },
    {
      icon: 'map-pin',
      title: 'Direcciones',
      subtitle: 'Administre sus direcciones de entrega',
      action: () => console.log('Direcciones'),
    },
    {
      icon: 'credit-card',
      title: 'Métodos de Pago',
      subtitle: 'Administre sus tarjetas y métodos de pago',
      action: () => console.log('Métodos de Pago'),
    },
    {
      icon: 'bell',
      title: 'Notificaciones',
      subtitle: 'Configure sus preferencias de notificaciones',
      action: () => console.log('Notificaciones'),
    },
    {
      icon: 'help-circle',
      title: 'Ayuda',
      subtitle: 'Preguntas frecuentes y soporte',
      action: () => console.log('Ayuda'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      <View style={styles.header}>
        <ThemedText style={styles.title}>Mi Perfil</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Feather name="user" size={40} color="#fff" />
            </View>
          </View>

          <View style={styles.infoContainer}>
            <ThemedText style={styles.name}>
              {user?.firstName} {user?.lastName || 'Usuario'}
            </ThemedText>
            <View style={styles.emailContainer}>
              <Feather name="mail" size={14} color={colors.textSecondary} style={styles.emailIcon} />
              <ThemedText style={styles.email}>{user?.email || 'email@example.com'}</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, index === menuItems.length - 1 && styles.lastMenuItem]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemIcon}>
                <Feather name={item.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.menuItemContent}>
                <ThemedText style={styles.menuItemTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.menuItemSubtitle}>{item.subtitle}</ThemedText>
              </View>
              <Feather name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, isLoading && styles.logoutButtonDisabled]}
          onPress={handleLogout}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          <Feather name="log-out" size={20} color="#fff" />
          <ThemedText style={styles.logoutText}>{isLoading ? 'Cerrando Sesión...' : 'Cerrar Sesión'}</ThemedText>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <ThemedText style={styles.versionText}>Versión 1.0.0</ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 12 : 24,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.h2,
    color: colors.text,
    marginLeft: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: colors.surface,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.h3,
    color: colors.text,
    marginBottom: 8,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailIcon: {
    marginRight: 6,
  },
  email: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
  },
  menuContainer: {
    backgroundColor: colors.surface,
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.body,
    color: colors.text,
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    marginHorizontal: 16,
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutText: {
    color: '#fff',
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.button,
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  versionText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.sizes.small,
    color: colors.textTertiary,
  },
});
