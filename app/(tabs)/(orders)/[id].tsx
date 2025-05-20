import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '../../../src/shared/components/ThemedText';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../src/constants/Colors';
import { useOrders } from '../../../src/features/orders/context/OrdersContext';
import { Order, OrderDetail } from '../../../src/features/orders/types/orders.types';
import { OrderItemRow } from '../../../src/features/orders/components/OrderItemRow';
import { OrderStatusBadge } from '../../../src/features/orders/components/OrderStatusBadge';
import { PurchaseStatusTracker } from '../../../src/features/orders/components/PurchaseStatusTracker';
import { DeliveryInfoCard } from '../../../src/features/orders/components/DeliveryInfoCard';
import { AppLoader } from '../../../src/shared/components/AppLoader';
import { formatDate, formatCurrency } from '../../../src/shared/utils/formatters';
import { typography } from '../../../src/constants/Typography';

export default function PurchaseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getOrderById, getPurchaseDetails } = useOrders();
  const [purchaseDetail, setPurchaseDetail] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (typeof id !== 'string') {
          throw new Error('ID de compra inválido');
        }

        // Intentamos obtener los detalles de compra primero
        const detailData = await getPurchaseDetails(id);

        if (detailData) {
          setPurchaseDetail(detailData);
        } else {
          // Si no hay detalles disponibles, usamos la información básica del pedido
          const orderData = await getOrderById(id);
          if (orderData) {
            setPurchaseDetail(orderData as OrderDetail);
          } else {
            setError('No se pudo encontrar la información de la compra');
          }
        }
      } catch (err) {
        console.error('Error fetching purchase details:', err);
        setError('Error al cargar los detalles de la compra');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseDetails();
  }, [id, getOrderById, getPurchaseDetails]);

  const handleShare = async () => {
    if (!purchaseDetail) return;

    try {
      const message =
        `¡Detalles de mi compra!\n` +
        `Pedido #${purchaseDetail.orderNumber}\n` +
        `Estado: ${getStatusText(purchaseDetail.status)}\n` +
        `Fecha: ${formatDate(purchaseDetail.date)}\n` +
        `Total: ${formatCurrency(purchaseDetail.total)}\n`;

      await Share.share({
        message,
        title: `Detalles de Compra #${purchaseDetail.orderNumber}`,
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return 'Procesando';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <AppLoader size="large" />
      </View>
    );
  }

  if (error || !purchaseDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="chevron-left" size={24} color="#000" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Detalles</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.notFoundContainer}>
          <Feather name="package" size={48} color={colors.primary} />
          <ThemedText style={styles.notFoundText}>{error || 'Compra no encontrada'}</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Compra #{purchaseDetail.orderNumber}</ThemedText>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Feather name="share-2" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <View style={styles.orderHeaderRow}>
            <ThemedText style={styles.sectionTitle}>Estado</ThemedText>
            <OrderStatusBadge status={purchaseDetail.status} />
          </View>

          <PurchaseStatusTracker currentStatus={purchaseDetail.status} />
        </View>

        <DeliveryInfoCard address={purchaseDetail.address} date={purchaseDetail.date} store={purchaseDetail.store} />

        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>Productos</ThemedText>

          {purchaseDetail.items.map((item, index) => (
            <OrderItemRow key={index} item={item} />
          ))}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Subtotal</ThemedText>
            <ThemedText style={styles.summaryValue}>{formatCurrency(purchaseDetail.subtotal)}</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Envío</ThemedText>
            <ThemedText style={styles.summaryValue}>{formatCurrency(purchaseDetail.shipping)}</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Impuesto</ThemedText>
            <ThemedText style={styles.summaryValue}>{formatCurrency(purchaseDetail.tax)}</ThemedText>
          </View>

          {purchaseDetail.discount !== undefined && purchaseDetail.discount > 0 && (
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Descuento</ThemedText>
              <ThemedText style={[styles.summaryValue, { color: colors.success }]}>
                -{formatCurrency(purchaseDetail.discount)}
              </ThemedText>
            </View>
          )}

          <View style={[styles.summaryRow, styles.totalRow]}>
            <ThemedText style={styles.totalLabel}>Total</ThemedText>
            <ThemedText style={styles.totalValue}>{formatCurrency(purchaseDetail.total)}</ThemedText>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>Método de Pago</ThemedText>
          <View style={styles.paymentMethodRow}>
            <Feather name="credit-card" size={24} color={colors.primary} style={styles.paymentIcon} />
            <ThemedText style={styles.paymentMethod}>{purchaseDetail.paymentMethod}</ThemedText>
          </View>
        </View>

        {purchaseDetail.status !== 'cancelled' && purchaseDetail.status !== 'completed' && (
          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.7}
            onPress={() => {
              // Aquí iría la lógica para cancelar la compra
              // Por ahora solo mostramos un log
              console.log('Cancelar compra:', purchaseDetail.id);
            }}
          >
            <Feather name="x-circle" size={20} color={colors.error} />
            <ThemedText style={styles.cancelButtonText}>Cancelar Compra</ThemedText>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>¿Necesitas ayuda con tu compra?</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.supportLink}>Contactar Soporte</ThemedText>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 48,
    paddingBottom: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  title: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: 20,
    color: colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: 18,
    marginTop: 16,
    color: colors.secondary,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionCard: {
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
  sectionTitle: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: 18,
    color: colors.text,
    marginBottom: 16,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: typography.fontFamily.sans,
    fontSize: 15,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontFamily: typography.fontFamily.sans,
    fontSize: 15,
    color: colors.text,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  totalLabel: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: 18,
    color: colors.text,
  },
  totalValue: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: 18,
    color: colors.primary,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    marginRight: 12,
  },
  paymentMethod: {
    fontFamily: typography.fontFamily.sans,
    fontSize: 16,
    color: colors.text,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 24,
  },
  cancelButtonText: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.button,
    color: colors.error,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  footerText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  supportLink: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.body,
    color: colors.primary,
  },
});