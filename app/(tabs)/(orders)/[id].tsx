import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, Share, Alert, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '../../../src/shared/components/ThemedText';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../src/constants/Colors';
import { useOrders } from '../../../src/features/orders/context/OrdersContext';
import { OrderDetail } from '../../../src/features/orders/types/orders.types';
import { OrderItemRow } from '../../../src/features/orders/components/OrderItemRow';
import { OrderStatusBadge } from '../../../src/features/orders/components/OrderStatusBadge';
import { PurchaseStatusTracker } from '../../../src/features/orders/components/PurchaseStatusTracker';
import { DeliveryInfoCard } from '../../../src/features/orders/components/DeliveryInfoCard';
import { AppLoader } from '../../../src/shared/components/AppLoader';
import { formatDate, formatCurrency } from '../../../src/shared/utils/formatters';
import { typography } from '../../../src/constants/Typography';
import { reorderItems } from '../../../src/features/orders/api/ordersService';

export default function PurchaseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getPurchaseDetails, refreshOrders } = useOrders();
  const [purchaseDetail, setPurchaseDetail] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReordering, setIsReordering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (typeof id !== 'string') {
          throw new Error('ID de compra inválido');
        }

        console.log('Fetching purchase details for ID:', id);
        const detailData = await getPurchaseDetails(id);

        if (detailData) {
          setPurchaseDetail(detailData);
        } else {
          setError('No se pudo encontrar la información de la compra');
        }
      } catch (err: any) {
        console.error('Error fetching purchase details:', err);
        setError(err.message || 'Error al cargar los detalles de la compra');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseDetails();
  }, [id, getPurchaseDetails]);

  const handleShare = async () => {
    if (!purchaseDetail) return;

    try {
      const itemsList = purchaseDetail.items
        .map((item) => `• ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}`)
        .join('\n');

      const message =
        `🛍️ Detalles de mi compra - ${purchaseDetail.store}\n\n` +
        `📦 Pedido: #${purchaseDetail.orderNumber}\n` +
        `📅 Fecha: ${formatDate(purchaseDetail.date)}\n` +
        `📊 Estado: ${getStatusText(purchaseDetail.status)}\n\n` +
        `🛒 Productos:\n${itemsList}\n\n` +
        `💰 Total: ${formatCurrency(purchaseDetail.total)}\n` +
        `📍 Dirección: ${purchaseDetail.address}`;

      await Share.share({
        message,
        title: `Compra #${purchaseDetail.orderNumber} - ${purchaseDetail.store}`,
      });
    } catch (error) {
      console.error('Error al compartir:', error);
      Alert.alert('Error', 'No se pudo compartir la información');
    }
  };

  const handleReorder = async () => {
    if (!purchaseDetail) return;

    Alert.alert('Reordenar productos', '¿Deseas agregar todos los productos de esta compra a un nuevo pedido?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Reordenar',
        onPress: async () => {
          try {
            setIsReordering(true);
            const response = await reorderItems(purchaseDetail.id);

            if (response.success) {
              Alert.alert('Éxito', response.message || 'Productos agregados al nuevo pedido', [
                {
                  text: 'Ver pedidos',
                  onPress: () => {
                    refreshOrders();
                    router.push('/(tabs)/');
                  },
                },
              ]);
            } else {
              Alert.alert('Error', response.message || 'No se pudo reordenar');
            }
          } catch (error: any) {
            console.error('Reorder error:', error);
            Alert.alert('Error', error.message || 'No se pudo reordenar los productos');
          } finally {
            setIsReordering(false);
          }
        },
      },
    ]);
  };

  const handleContactSupport = async () => {
    const supportOptions = [
      { title: 'Llamar', action: () => Linking.openURL('tel:+5931234567') },
      {
        title: 'WhatsApp',
        action: () =>
          Linking.openURL(
            'whatsapp://send?phone=5931234567&text=Hola, necesito ayuda con mi pedido #' + purchaseDetail?.orderNumber,
          ),
      },
      {
        title: 'Email',
        action: () =>
          Linking.openURL('mailto:soporte@almendros.com?subject=Consulta sobre pedido #' + purchaseDetail?.orderNumber),
      },
    ];

    Alert.alert('Contactar Soporte', 'Selecciona cómo prefieres contactarnos:', [
      ...supportOptions.map((option) => ({
        text: option.title,
        onPress: option.action,
      })),
      { text: 'Cancelar', style: 'cancel' },
    ]);
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
        <ThemedText style={styles.loadingText}>Cargando detalles...</ThemedText>
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
          <ThemedText style={styles.title}>Detalles de Compra</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <Feather name="alert-circle" size={48} color={colors.error} />
          </View>
          <ThemedText style={styles.errorTitle}>¡Oops!</ThemedText>
          <ThemedText style={styles.errorText}>{error || 'No se pudo cargar la información de la compra'}</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
            <ThemedText style={styles.retryButtonText}>Intentar de nuevo</ThemedText>
          </TouchableOpacity>
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
        <View style={styles.headerCenter}>
          <ThemedText style={styles.title}>#{purchaseDetail.orderNumber}</ThemedText>
          <ThemedText style={styles.subtitle}>{purchaseDetail.store}</ThemedText>
        </View>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Feather name="share-2" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Estado del pedido */}
        <View style={styles.sectionCard}>
          <View style={styles.orderHeaderRow}>
            <ThemedText style={styles.sectionTitle}>Estado del Pedido</ThemedText>
            <OrderStatusBadge status={purchaseDetail.status} />
          </View>
          <PurchaseStatusTracker currentStatus={purchaseDetail.status} />
        </View>

        {/* Información de entrega */}
        <DeliveryInfoCard address={purchaseDetail.address} date={purchaseDetail.date} store={purchaseDetail.store} />

        {/* Productos */}
        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>Productos ({purchaseDetail.items.length})</ThemedText>

          {purchaseDetail.items.map((item, index) => (
            <OrderItemRow key={`${item.id}-${index}`} item={item} />
          ))}

          {/* Resumen de precios */}
          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Subtotal</ThemedText>
            <ThemedText style={styles.summaryValue}>{formatCurrency(purchaseDetail.subtotal)}</ThemedText>
          </View>

          {purchaseDetail.shipping > 0 && (
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Envío</ThemedText>
              <ThemedText style={styles.summaryValue}>{formatCurrency(purchaseDetail.shipping)}</ThemedText>
            </View>
          )}

          {purchaseDetail.tax > 0 && (
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Impuestos</ThemedText>
              <ThemedText style={styles.summaryValue}>{formatCurrency(purchaseDetail.tax)}</ThemedText>
            </View>
          )}

          {purchaseDetail.discount && purchaseDetail.discount > 0 && (
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

        {/* Método de pago */}
        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>Método de Pago</ThemedText>
          <View style={styles.paymentMethodRow}>
            <Feather name="credit-card" size={24} color={colors.primary} style={styles.paymentIcon} />
            <ThemedText style={styles.paymentMethod}>{purchaseDetail.paymentMethod}</ThemedText>
          </View>
        </View>

        {/* Acciones disponibles */}
        <View style={styles.actionsContainer}>
          {purchaseDetail.status === 'completed' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.reorderButton]}
              onPress={handleReorder}
              disabled={isReordering}
              activeOpacity={0.7}
            >
              {isReordering ? <AppLoader size="small" color="#fff" /> : <Feather name="repeat" size={20} color="#fff" />}
              <ThemedText style={styles.actionButtonText}>{isReordering ? 'Reordenando...' : 'Reordenar'}</ThemedText>
            </TouchableOpacity>
          )}

          {purchaseDetail.status !== 'cancelled' && purchaseDetail.status !== 'completed' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              activeOpacity={0.7}
              onPress={() => {
                Alert.alert('Cancelar Pedido', '¿Estás seguro de que deseas cancelar este pedido?', [
                  { text: 'No', style: 'cancel' },
                  {
                    text: 'Sí, cancelar',
                    style: 'destructive',
                    onPress: () => {
                      // Aquí iría la lógica para cancelar
                      console.log('Cancelar pedido:', purchaseDetail.id);
                    },
                  },
                ]);
              }}
            >
              <Feather name="x-circle" size={20} color={colors.error} />
              <ThemedText style={[styles.actionButtonText, { color: colors.error }]}>Cancelar Pedido</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Footer con soporte */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>¿Necesitas ayuda con tu compra?</ThemedText>
          <TouchableOpacity onPress={handleContactSupport}>
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
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: 18,
    color: colors.text,
  },
  subtitle: {
    fontFamily: typography.fontFamily.sans,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${colors.error}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: 24,
    color: colors.text,
    marginBottom: 12,
  },
  errorText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: 16,
    color: '#fff',
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
    borderRadius: 16,
    padding: 20,
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
    backgroundColor: colors.divider,
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  totalLabel: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: 18,
    color: colors.text,
  },
  totalValue: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: 20,
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
  actionsContainer: {
    marginVertical: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  reorderButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
  },
  actionButtonText: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  footerText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  supportLink: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: 16,
    color: colors.primary,
  },
});
