import { useCallback } from 'react';
import { View, StyleSheet, RefreshControl, SafeAreaView, Platform, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { OrderCard } from '@/features/orders/components/OrderCard';
import { ThemedText } from '../../components/ThemedText';
import { colors } from '@/constants/Colors';
import { Spinner } from '@/components/ui/Spinner';
import { Order } from '@/features/orders/types/orders.types';

export default function OrdersScreen() {
  const { orders, loading, refreshOrders, refreshing } = useOrders();

  const renderItem = useCallback(({ item }: { item: Order }) => {
    return <OrderCard order={item} />;
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" />
      </View>
    );
  }

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={64} color={colors.textSecondary} />
      <ThemedText style={styles.emptyText}>No tiene pedidos</ThemedText>
      <ThemedText style={styles.emptySubtext}>
        Los pedidos que realice aparecerán aquí
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Mis Pedidos</ThemedText>
      </View>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
        ListEmptyComponent={renderEmptyList}
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
    fontFamily: 'System',
    fontSize: 34,
    fontWeight: 'bold',
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontFamily: 'System',
    fontSize: 15,
    color: colors.textTertiary,
    marginTop: 8,
  },
});