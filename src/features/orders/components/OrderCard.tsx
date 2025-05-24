import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '../../../shared/components/ThemedText';
import { Order } from '../types/orders.types';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../constants/Colors';
import { formatDate, formatCurrency } from '../../../shared/utils/formatters';
import { OrderStatusBadge } from './OrderStatusBadge';
import { typography } from '../../../constants/Typography';

type OrderCardProps = {
  order: Order;
};

export function OrderCard({ order }: OrderCardProps) {
  const handlePress = () => {
    // Navegar a la nueva ruta de detalle
    router.push(`/(tabs)/order-detail?id=${order.id}` as any);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <ThemedText style={styles.orderNumber}>#{order.orderNumber}</ThemedText>
          <ThemedText style={styles.orderDate}>{formatDate(order.date)}</ThemedText>
        </View>
        <OrderStatusBadge status={order.status} size="medium" />
      </View>

      <View style={styles.content}>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <View style={styles.infoRow}>
              <Feather name="package" size={16} color={colors.textSecondary} style={styles.infoIcon} />
              <ThemedText style={styles.infoLabel}>Productos:</ThemedText>
            </View>
            <ThemedText style={styles.infoValue}>{order.items.length}</ThemedText>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={16} color={colors.textSecondary} style={styles.infoIcon} />
              <ThemedText style={styles.infoLabel}>Dirección:</ThemedText>
            </View>
            <ThemedText style={styles.infoValue} numberOfLines={2}>
              {order.address}
            </ThemedText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <ThemedText style={styles.totalLabel}>Total del pedido</ThemedText>
            <ThemedText style={styles.totalValue}>{formatCurrency(order.total)}</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.viewDetails}>Ver detalles completos</ThemedText>
        <Feather name="chevron-right" size={18} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: typography.sizes.h4,
    fontFamily: typography.fontFamily.sansBold,
    color: colors.primary,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.sans,
    color: colors.textSecondary,
  },
  content: {
    padding: 20,
  },
  infoGrid: {
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabel: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.sans,
  },
  infoValue: {
    fontSize: typography.sizes.body,
    color: colors.text,
    fontFamily: typography.fontFamily.sans,
    marginLeft: 24, // Align with label after icon
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 16,
  },
  totalSection: {
    paddingTop: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.sansBold,
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: typography.sizes.h4,
    fontFamily: typography.fontFamily.sansBold,
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: Platform.OS === 'ios' ? colors.surface : colors.backgroundAlt,
  },
  viewDetails: {
    fontSize: typography.sizes.body,
    color: colors.primary,
    fontFamily: typography.fontFamily.sansBold,
    marginRight: 8,
  },
});
