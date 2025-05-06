import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  Platform,
  FlatList,
  StatusBar
} from 'react-native';
import { ThemedText } from '../../src/shared/components/ThemedText';
import { colors } from '../../src/constants/Colors';
import { AppLoader } from '../../src/shared/components/AppLoader';
import { OrderCard } from '../../src/features/orders/components/OrderCard';
import { EmptyState } from '../../src/shared/components/ui/EmptyState';
import { useOrders } from '../../src/features/orders/context/OrdersContext';
import { Feather } from '@expo/vector-icons';
import { Order } from '../../src/features/orders/types/orders.types';
import { typography } from '../../src/constants/Typography';

export default function OrdersScreen() {
  const { orders, isLoading, isRefreshing, refreshOrders, error } = useOrders();

  const renderItem = useCallback(({ item }: { item: Order }) => {
    return <OrderCard order={item} />;
  }, []);

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <AppLoader size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      <View style={styles.header}>
        <ThemedText style={styles.title}>Mis Pedidos</ThemedText>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={20} color={colors.error} style={styles.errorIcon} />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
            icon={<Feather name="package" size={56} color={colors.primary} />}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  separator: {
    height: 16,
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(211, 47, 47, 0.08)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.sizes.body,
    color: colors.error,
    flex: 1,
  },
});