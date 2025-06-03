import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '../../../shared/components/ThemedText';
import { Purchase } from '../types/purchases.types';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../constants/Colors';
import { formatDate, formatCurrency } from '../../../shared/utils/formatters';
import { typography } from '../../../constants/Typography';

type PurchaseCardProps = {
  purchase: Purchase;
};

// Helper function para obtener el icono y color del status
const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'completed':
      return { icon: 'check-circle' as const, color: colors.success, text: 'Completado' };
    case 'pending':
      return { icon: 'clock' as const, color: colors.warning, text: 'Pendiente' };
    case 'cancelled':
      return { icon: 'x-circle' as const, color: colors.error, text: 'Cancelado' };
    default:
      return { icon: 'check-circle' as const, color: colors.success, text: 'Completado' };
  }
};

export function PurchaseCard({ purchase }: PurchaseCardProps) {
  const handlePress = () => {
    // Navegar a la nueva ruta de detalle
    router.push(`/(tabs)/purchase-detail?id=${purchase.id}` as any);
  };

  const statusDisplay = getStatusDisplay(purchase.status);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.purchaseInfo}>
          <ThemedText style={styles.purchaseNumber}>#{purchase.purchaseNumber}</ThemedText>
          <ThemedText style={styles.purchaseDate}>{formatDate(purchase.date)}</ThemedText>
        </View>
        <View style={[styles.badge, { backgroundColor: `${statusDisplay.color}15`, borderColor: statusDisplay.color }]}>
          <Feather name={statusDisplay.icon} size={16} color={statusDisplay.color} />
          <ThemedText style={[styles.badgeText, { color: statusDisplay.color }]}>{statusDisplay.text}</ThemedText>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <View style={styles.infoRow}>
              <Feather name="package" size={16} color={colors.textSecondary} style={styles.infoIcon} />
              <ThemedText style={styles.infoLabel}>Productos:</ThemedText>
            </View>
            <ThemedText style={styles.infoValue}>{purchase.items.length}</ThemedText>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoRow}>
              <Feather name="credit-card" size={16} color={colors.textSecondary} style={styles.infoIcon} />
              <ThemedText style={styles.infoLabel}>Método de pago:</ThemedText>
            </View>
            <ThemedText style={styles.infoValue} numberOfLines={2}>
              {purchase.paymentMethod}
            </ThemedText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <ThemedText style={styles.totalLabel}>Total de la compra</ThemedText>
            <ThemedText style={styles.totalValue}>{formatCurrency(purchase.total)}</ThemedText>
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
  purchaseInfo: {
    flex: 1,
  },
  purchaseNumber: {
    fontSize: typography.sizes.h4,
    fontFamily: typography.fontFamily.sansBold,
    color: colors.primary,
    marginBottom: 4,
  },
  purchaseDate: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.sans,
    color: colors.textSecondary,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.caption,
    marginLeft: 4,
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
