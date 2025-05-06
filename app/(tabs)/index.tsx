import React, { useCallback } from 'react';
import { View, StyleSheet, RefreshControl, SafeAreaView, Platform, FlatList } from 'react-native';
import { ThemedText } from '../../src/shared/components/ThemedText';
import { colors } from '../../src/constants/Colors';
import { AppLoader } from '../../src/shared/components/AppLoader';
import { OrderCard } from '../../src/features/orders/components/OrderCard';
import { EmptyState } from '../../src/shared/components/ui/EmptyState';
import { useOrders } from '../../src/features/orders/context/OrdersContext';
import { Feather } from '@expo/vector-icons';
import { Order } from '../../src/features/orders/types/orders.types';

export default function OrdersScreen() {
  const { orders, isLoading, isRefreshing, refreshOrders, error } = useOrders();
  const renderItem = useCallback(({ item }: { item: Order }) => {
    return <OrderCard order={item} />;
  }, []);

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <AppLoader size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Mis Pedidos</ThemedText>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshOrders}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={<Feather name="package" size={48} color={colors.primary} />}
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
  errorContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 8,
  },
  errorText: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
  },
});