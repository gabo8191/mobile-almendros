import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { colors } from '../../src/constants/Colors';
import { TabBarBackground } from '../../src/shared/components/ui/TabBarBackground';
import { PurchasesProvider } from '../../src/features/purchases/context/PurchasesContext';
import { Feather } from '@expo/vector-icons';
import { typography } from '../../src/constants/Typography';

export default function TabLayout() {
  return (
    <PurchasesProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarStyle: {
            position: 'absolute',
            borderTopWidth: 0,
            elevation: 0,
            height: 84,
            paddingBottom: Platform.OS === 'ios' ? 28 : 12,
            paddingTop: 12,
            backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.surface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
          },
          tabBarBackground: () => <TabBarBackground />,
          tabBarLabelStyle: {
            fontFamily: typography.fontFamily.sans,
            fontSize: typography.sizes.small,
            fontWeight: '600',
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
          tabBarItemStyle: {
            paddingTop: 8,
          },
        }}
      >
        <Tabs.Screen
          name="purchases"
          options={{
            title: 'Mis Compras',
            tabBarIcon: ({ color, size }) => (
              <View style={styles.iconContainer}>
                <Feather name="shopping-bag" size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Mi Perfil',
            tabBarIcon: ({ color, size }) => (
              <View style={styles.iconContainer}>
                <Feather name="user" size={size} color={color} />
              </View>
            ),
          }}
        />
        {/* Ocultar la ruta de detalle de las pestañas */}
        <Tabs.Screen
          name="purchase-detail"
          options={{
            href: null, // Esto oculta la pestaña
          }}
        />
      </Tabs>
    </PurchasesProvider>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
