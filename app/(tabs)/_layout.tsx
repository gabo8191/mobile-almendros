import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { colors } from '../../src/constants/Colors';
import { TabBarBackground } from '../../src/shared/components/ui/TabBarBackground';
import { OrdersProvider } from '../../src/features/orders/context/OrdersContext';
import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <OrdersProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.secondary,
          tabBarStyle: {
            position: 'absolute',
            borderTopWidth: 0,
            elevation: 0,
            height: 84,
            paddingBottom: Platform.OS === 'ios' ? 28 : 8,
            paddingTop: 8,
            backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#fff',
          },
          tabBarBackground: () => <TabBarBackground />,
          tabBarLabelStyle: {
            fontFamily: 'SF-Pro-Text-Medium',
            fontSize: 12,
          }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Pedidos',
            tabBarIcon: ({ color, size }) => (
              <Feather name="package" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </OrdersProvider>
  );
}