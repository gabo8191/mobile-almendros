import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedText } from '../../src/shared/components/ThemedText';
import { colors } from '../../src/constants/Colors';
import { AppLoader } from '../../src/shared/components/AppLoader';
import { useOrders } from '../../src/features/orders/context/PurchasesContext';
import { Feather } from '@expo/vector-icons';
import { Order } from '../../src/features/orders/types/purchases.types';
import { typography } from '../../src/constants/Typography';
import { formatDate, formatCurrency } from '../../src/shared/utils/formatters';
import { SupportContactCard } from '../../src/features/orders/components/SupportContactCard';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      console.log('Cargando detalles de la compra ID:', id);

      const orderData = await getOrderById(id);
      if (orderData) {
        setOrder(orderData);
        console.log('Detalles de compra cargados:', orderData.orderNumber);
      } else {
        setError('No se encontró la compra solicitada');
      }
    } catch (err: any) {
      console.error('Error cargando detalles de compra:', err);
      setError(err.message || 'Error al cargar los detalles de la compra');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
        <View style={styles.loadingContainer}>
          <AppLoader size="large" color={colors.primary} />
          <ThemedText style={styles.loadingText}>Cargando detalles de la compra...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.7}>
            <Feather name="arrow-left" size={24} color={colors.primary} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Detalles de Compra</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.errorContainer}>
          <View style={styles.errorContent}>
            <Feather name="alert-circle" size={56} color={colors.error} />
            <ThemedText style={styles.errorTitle}>Error al cargar</ThemedText>
            <ThemedText style={styles.errorMessage}>{error || 'No se pudo encontrar la compra solicitada'}</ThemedText>
            <TouchableOpacity style={styles.retryButton} onPress={fetchOrderDetails} activeOpacity={0.7}>
              <ThemedText style={styles.retryButtonText}>Intentar nuevamente</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header con navegación */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.7}>
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Detalles de Compra</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Información principal de la compra */}
        <View style={styles.orderHeader}>
          <View style={styles.orderTitleRow}>
            <ThemedText style={styles.orderNumber}>Compra #{order.orderNumber}</ThemedText>
          </View>
          <ThemedText style={styles.orderDate}>Fecha: {formatDate(order.date)}</ThemedText>
        </View>

        {/* Productos comprados */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Productos Comprados</ThemedText>
          <View style={styles.itemsContainer}>
            {order.items.map((item, index) => (
              <View key={item.id} style={[styles.orderItem, index === order.items.length - 1 && styles.lastItem]}>
                <View style={styles.itemInfo}>
                  <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                  <ThemedText style={styles.itemDetails}>
                    Cantidad: {item.quantity} × {formatCurrency(item.price)}
                  </ThemedText>
                </View>
                <ThemedText style={styles.itemTotal}>{formatCurrency(item.quantity * item.price)}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Resumen de pago */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Resumen de Pago</ThemedText>
          <View style={styles.costSummary}>
            <View style={styles.costRow}>
              <ThemedText style={styles.costLabel}>Subtotal</ThemedText>
              <ThemedText style={styles.costValue}>{formatCurrency(order.subtotal)}</ThemedText>
            </View>

            {order.tax > 0 && (
              <View style={styles.costRow}>
                <ThemedText style={styles.costLabel}>IVA</ThemedText>
                <ThemedText style={styles.costValue}>{formatCurrency(order.tax)}</ThemedText>
              </View>
            )}

            <View style={styles.divider} />
            <View style={styles.costRow}>
              <ThemedText style={styles.totalLabel}>Total Pagado</ThemedText>
              <ThemedText style={styles.totalValue}>{formatCurrency(order.total)}</ThemedText>
            </View>
          </View>
        </View>

        {/* Información de pago */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Método de Pago</ThemedText>
          <View style={styles.paymentInfo}>
            <Feather name="credit-card" size={20} color={colors.primary} style={styles.paymentIcon} />
            <ThemedText style={styles.paymentMethod}>{order.paymentMethod}</ThemedText>
          </View>
        </View>

        {/* Contacto de soporte */}
        <SupportContactCard orderNumber={order.orderNumber} />

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 24,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.h3,
    color: colors.text,
  },
  placeholder: {
    width: 44,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  errorTitle: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.h3,
    color: colors.error,
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.textLight,
    fontFamily: typography.fontFamily.sansBold,
  },
  scrollView: {
    flex: 1,
  },
  orderHeader: {
    backgroundColor: colors.surface,
    padding: 20,
    marginBottom: 16,
  },
  orderTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.h2,
    color: colors.primary,
  },
  orderDate: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
  },
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.h4,
    color: colors.text,
    marginBottom: 16,
  },
  itemsContainer: {
    gap: 0,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.body,
    color: colors.text,
    marginBottom: 4,
  },
  itemDetails: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  itemTotal: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.body,
    color: colors.primary,
  },
  costSummary: {
    gap: 8,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  costLabel: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
  },
  costValue: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.body,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 8,
  },
  totalLabel: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.h4,
    color: colors.text,
  },
  totalValue: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.h4,
    color: colors.primary,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
  },
  paymentIcon: {
    marginRight: 12,
  },
  paymentMethod: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.sizes.body,
    color: colors.text,
  },
  bottomSpacing: {
    height: 100,
  },
});
