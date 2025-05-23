import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { colors } from '@/src/constants/Colors';
import { typography } from '@/src/constants/Typography';
import { Feather } from '@expo/vector-icons';
import { formatDate } from '@/src/shared/utils/formatters';

type DeliveryInfoCardProps = {
  address: string;
  date: string;
  store?: string;
};

export function DeliveryInfoCard({ address, date, store }: DeliveryInfoCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.title}>Información de Entrega</ThemedText>
      </View>

      <View style={styles.contentRow}>
        <View style={styles.iconContainer}>
          <Feather name="map-pin" size={20} color={colors.primary} />
        </View>
        <View style={styles.infoContainer}>
          <ThemedText style={styles.label}>Dirección de Entrega</ThemedText>
          <ThemedText style={styles.value}>{address}</ThemedText>
        </View>
      </View>

      <View style={styles.contentRow}>
        <View style={styles.iconContainer}>
          <Feather name="calendar" size={20} color={colors.primary} />
        </View>
        <View style={styles.infoContainer}>
          <ThemedText style={styles.label}>Fecha de Pedido</ThemedText>
          <ThemedText style={styles.value}>{formatDate(date)}</ThemedText>
        </View>
      </View>

      {store && (
        <View style={styles.contentRow}>
          <View style={styles.iconContainer}>
            <Feather name="shopping-bag" size={20} color={colors.primary} />
          </View>
          <View style={styles.infoContainer}>
            <ThemedText style={styles.label}>Tienda</ThemedText>
            <ThemedText style={styles.value}>{store}</ThemedText>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    marginBottom: 16,
  },
  title: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.h4,
    color: colors.text,
  },
  contentRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.sizes.body,
    color: colors.text,
  },
});
