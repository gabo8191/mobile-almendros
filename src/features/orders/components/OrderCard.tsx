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
    router.push(`/(tabs)/(orders)/${order.id}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.header}>
        <ThemedText style={styles.orderNumber}>Pedido #{order.orderNumber}</ThemedText>
        <OrderStatusBadge status={order.status} />
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Feather name="calendar" size={16} color={colors.textSecondary} style={styles.infoIcon} />
            <ThemedText style={styles.infoLabel}>Fecha:</ThemedText>
            <ThemedText style={styles.infoValue}>{formatDate(order.date)}</ThemedText>
          </View>

          <View style={styles.infoItem}>
            <Feather name="package" size={16} color={colors.textSecondary} style={styles.infoIcon} />
            <ThemedText style={styles.infoLabel}>Productos:</ThemedText>
            <ThemedText style={styles.infoValue}>{order.items.length}</ThemedText>
          </View>
        </View>

        <View style={styles.totalRow}>
          <ThemedText style={styles.totalLabel}>Total:</ThemedText>
          <ThemedText style={styles.totalValue}>{formatCurrency(order.total)}</ThemedText>
        </View>
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.viewDetails}>Ver detalles</ThemedText>
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginHorizontal: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.backgroundAlt,
  },
  orderNumber: {
    fontSize: typography.sizes.h4,
    fontFamily: typography.fontFamily.sansBold,
    color: colors.primary,
  },
  content: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabel: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.sans,
    marginRight: 4,
  },
  infoValue: {
    fontSize: typography.sizes.caption,
    color: colors.text,
    fontFamily: typography.fontFamily.sans,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: Platform.OS === 'ios' ? colors.surface : colors.backgroundAlt,
  },
  viewDetails: {
    fontSize: typography.sizes.caption,
    color: colors.primary,
    fontFamily: typography.fontFamily.sans,
    marginRight: 8,
  },
});
