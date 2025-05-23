import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { colors } from '../../src/constants/Colors';
import { TabBarBackground } from '../../src/shared/components/ui/TabBarBackground';
import { OrdersProvider } from '../../src/features/orders/context/OrdersContext';
import { Feather } from '@expo/vector-icons';
import { typography } from '../../src/constants/Typography';

export default function TabLayout() {
  return (
    <OrdersProvider>
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
          name="index"
          options={{
            title: 'Pedidos',
            tabBarIcon: ({ color, size }) => (
              <View style={styles.iconContainer}>
                <Feather name="package" size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size }) => (
              <View style={styles.iconContainer}>
                <Feather name="user" size={size} color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
    </OrdersProvider>
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