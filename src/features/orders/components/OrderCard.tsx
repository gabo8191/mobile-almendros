import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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
        router.push(`/order/${order.id}`);
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <ThemedText style={styles.orderNumber} type="subtitle">
                    Pedido #{order.orderNumber}
                </ThemedText>
                <OrderStatusBadge status={order.status} />
            </View>

            <View style={styles.content}>
                <View style={styles.infoRow}>
                    <ThemedText style={styles.label} type="caption">Fecha:</ThemedText>
                    <ThemedText style={styles.value} type="default">{formatDate(order.date)}</ThemedText>
                </View>

                <View style={styles.infoRow}>
                    <ThemedText style={styles.label} type="caption">Productos:</ThemedText>
                    <ThemedText style={styles.value} type="default">{order.items.length}</ThemedText>
                </View>

                <View style={styles.infoRow}>
                    <ThemedText style={styles.label} type="caption">Total:</ThemedText>
                    <ThemedText style={styles.total} type="defaultSemiBold">{formatCurrency(order.total)}</ThemedText>
                </View>
            </View>

            <View style={styles.footer}>
                <ThemedText style={styles.viewDetails} type="link">Ver detalles</ThemedText>
                <Feather name="chevron-right" size={20} color={colors.primary} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    orderNumber: {
        fontSize: typography.sizes.h3,
    },
    content: {
        paddingVertical: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        color: colors.secondary,
    },
    value: {
        fontSize: typography.sizes.body,
    },
    total: {
        color: colors.primary,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    viewDetails: {
        color: colors.primary,
        marginRight: 4,
    },
});