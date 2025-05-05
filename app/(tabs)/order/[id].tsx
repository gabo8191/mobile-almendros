import { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { colors } from '@/src/constants/Colors';
import { useOrders } from '@/src/features/orders/hooks/useOrders';
import { OrderItemRow } from '@/src/features/orders/components/OrderItemRow';
import { OrderStatusBadge } from '@/src/features/orders/components/OrderStatusBadge';
import { Button } from '@/src/shared/components/ui/Button';
import { Spinner } from '@/src/shared/components/ui/Spinner';
import { formatDate, formatCurrency } from '@/src/shared/utils/formatters';
import { Order } from '@/src/features/orders/types/orders.types';

export default function OrderDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { getOrderById, cancelOrder, loading } = useOrders();
    const [order, setOrder] = useState<Order | null>(null);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setFetchLoading(true);
                const orderData = await getOrderById(String(id));
                setOrder(orderData);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setFetchLoading(false);
            }
        };

        fetchOrder();
    }, [id, getOrderById]);

    const handleCancelOrder = () => {
        if (!order) return;

        Alert.alert(
            "Cancelar Pedido",
            "¿Está seguro que desea cancelar este pedido?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Sí, Cancelar",
                    onPress: async () => {
                        try {
                            await cancelOrder(order.id);
                            // Fetch the updated order
                            const updatedOrder = await getOrderById(String(id));
                            setOrder(updatedOrder);
                            Alert.alert("Éxito", "El pedido ha sido cancelado");
                        } catch (error) {
                            console.error('Error canceling order:', error);
                            Alert.alert("Error", "No se pudo cancelar el pedido");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    if (fetchLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Spinner size="large" />
            </View>
        );
    }

    if (!order) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <ThemedText style={styles.title}>Detalles</ThemedText>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.notFoundContainer}>
                    <Ionicons name="cube-outline" size={48} color={colors.primary} />
                    <ThemedText style={styles.notFoundText}>Pedido no encontrado</ThemedText>
                </View>
            </SafeAreaView>
        );
    }

    const canCancel = order.status === 'pending' || order.status === 'processing';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <ThemedText style={styles.title}>Pedido #{order.orderNumber}</ThemedText>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.sectionCard}>
                    <View style={styles.orderHeaderRow}>
                        <ThemedText style={styles.sectionTitle}>Estado</ThemedText>
                        <OrderStatusBadge status={order.status} />
                    </View>

                    <View style={styles.infoRow}>
                        <ThemedText style={styles.infoLabel}>Fecha:</ThemedText>
                        <ThemedText style={styles.infoValue}>{formatDate(order.date)}</ThemedText>
                    </View>

                    <View style={styles.infoRow}>
                        <ThemedText style={styles.infoLabel}>Dirección:</ThemedText>
                        <ThemedText style={styles.infoValue}>{order.address}</ThemedText>
                    </View>

                    {canCancel && (
                        <View style={styles.cancelButtonContainer}>
                            <Button
                                title="Cancelar Pedido"
                                onPress={handleCancelOrder}
                                variant="outline"
                                loading={loading}
                                fullWidth
                            />
                        </View>
                    )}
                </View>

                <View style={styles.sectionCard}>
                    <ThemedText style={styles.sectionTitle}>Productos</ThemedText>

                    {order.items.map((item, index) => (
                        <OrderItemRow key={index} item={item} />
                    ))}

                    <View style={styles.divider} />

                    <View style={styles.summaryRow}>
                        <ThemedText style={styles.summaryLabel}>Subtotal</ThemedText>
                        <ThemedText style={styles.summaryValue}>{formatCurrency(order.subtotal)}</ThemedText>
                    </View>

                    <View style={styles.summaryRow}>
                        <ThemedText style={styles.summaryLabel}>Envío</ThemedText>
                        <ThemedText style={styles.summaryValue}>{formatCurrency(order.shipping)}</ThemedText>
                    </View>

                    <View style={styles.summaryRow}>
                        <ThemedText style={styles.summaryLabel}>Impuesto</ThemedText>
                        <ThemedText style={styles.summaryValue}>{formatCurrency(order.tax)}</ThemedText>
                    </View>

                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <ThemedText style={styles.totalLabel}>Total</ThemedText>
                        <ThemedText style={styles.totalValue}>{formatCurrency(order.total)}</ThemedText>
                    </View>
                </View>

                <View style={styles.sectionCard}>
                    <ThemedText style={styles.sectionTitle}>Método de Pago</ThemedText>
                    <ThemedText style={styles.paymentMethod}>{order.paymentMethod}</ThemedText>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 8 : 48,
        paddingBottom: 8,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontFamily: 'System',
        fontSize: 20,
        fontWeight: 'bold',
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
        fontFamily: 'System',
        fontSize: 18,
        fontWeight: '500',
        marginTop: 16,
        color: colors.textSecondary,
    },
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    sectionCard: {
        backgroundColor: '#fff',
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
        fontFamily: 'System',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    orderHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    infoLabel: {
        fontFamily: 'System',
        fontSize: 16,
        fontWeight: '500',
        width: 90,
        color: colors.textSecondary,
    },
    infoValue: {
        fontFamily: 'System',
        fontSize: 16,
        flex: 1,
    },
    cancelButtonContainer: {
        marginTop: 16,
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
        fontFamily: 'System',
        fontSize: 15,
        color: colors.textSecondary,
    },
    summaryValue: {
        fontFamily: 'System',
        fontSize: 15,
    },
    totalRow: {
        marginTop: 8,
    },
    totalLabel: {
        fontFamily: 'System',
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        fontFamily: 'System',
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
    },
    paymentMethod: {
        fontFamily: 'System',
        fontSize: 16,
    },
});