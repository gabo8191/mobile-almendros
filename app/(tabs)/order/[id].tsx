import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '../../../src/shared/components/ThemedText';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../src/constants/Colors';
import { useOrders } from '../../../src/features/orders/context/OrdersContext';
import { Order } from '../../../src/features/orders/types/orders.types';
import { OrderItemRow } from '../../../src/features/orders/components/OrderItemRow';
import { OrderStatusBadge } from '../../../src/features/orders/components/OrderStatusBadge';
import { AppLoader } from '../../../src/shared/components/AppLoader';
import { formatDate, formatCurrency } from '../../../src/shared/utils/formatters';

export default function OrderDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { getOrderById } = useOrders();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setIsLoading(true);
                setError(null);

                if (typeof id !== 'string') {
                    throw new Error('ID de pedido inválido');
                }

                const orderData = await getOrderById(id);
                if (orderData) {
                    setOrder(orderData);
                } else {
                    setError('No se pudo encontrar el pedido');
                }
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Error al cargar el pedido');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [id, getOrderById]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <AppLoader size="large" />
            </View>
        );
    }

    if (error || !order) {
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
                    <ThemedText style={styles.notFoundText}>
                        {error || 'Pedido no encontrado'}
                    </ThemedText>
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
        fontFamily: 'SF-Pro-Display-Bold',
        fontSize: 20,
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
        fontFamily: 'SF-Pro-Display-Medium',
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
        fontFamily: 'SF-Pro-Display-Bold',
        fontSize: 18,
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
        fontFamily: 'SF-Pro-Text-Medium',
        fontSize: 16,
        width: 90,
        color: colors.secondary,
    },
    infoValue: {
        fontFamily: 'SF-Pro-Text-Regular',
        fontSize: 16,
        flex: 1,
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
        fontFamily: 'SF-Pro-Text-Regular',
        fontSize: 15,
        color: colors.secondary,
    },
    summaryValue: {
        fontFamily: 'SF-Pro-Text-Regular',
        fontSize: 15,
    },
    totalRow: {
        marginTop: 8,
    },
    totalLabel: {
        fontFamily: 'SF-Pro-Text-Bold',
        fontSize: 18,
    },
    totalValue: {
        fontFamily: 'SF-Pro-Display-Bold',
        fontSize: 18,
        color: colors.primary,
    },
    paymentMethod: {
        fontFamily: 'SF-Pro-Text-Regular',
        fontSize: 16,
    },
});