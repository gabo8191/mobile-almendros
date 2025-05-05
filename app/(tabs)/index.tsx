import { useCallback } from 'react';
import { View, StyleSheet, RefreshControl, SafeAreaView, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { OrderCard } from '@/features/orders/components/OrderCard';
import { ThemedText } from '../../components/ThemedText';
import { Package } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';

export default function OrdersScreen() {
  const { orders, loading, refreshOrders, refreshing } = useOrders();

  const renderItem = useCallback(({ item }) => {
    return <OrderCard order={item} />;
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Mis Pedidos</ThemedText>
      </View>

      <FlashList
        data={orders}
        renderItem={renderItem}
        estimatedItemSize={100}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshOrders}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={<Package size={48} color={colors.primary} />}
            title="No hay pedidos"
            description="No se encontraron pedidos en su cuenta."
          />
        }
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
});