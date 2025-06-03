import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/shared/context/AuthContext';
import { AppLoader } from '../src/shared/components/AppLoader';
import { colors } from '../src/constants/Colors';

export default function IndexScreen() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Usuario autenticado, redirigir a compras (historial de compras)
        router.replace('/(tabs)/purchases');
      } else {
        // Usuario no autenticado, redirigir a login
        router.replace('/(auth)/login');
      }
    }
  }, [user, isLoading]);

  return (
    <View style={styles.container}>
      <AppLoader size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
