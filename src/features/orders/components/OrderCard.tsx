import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { Order } from '../types/orders.types';
import { colors } from '@/src/constants/Colors';
import { formatDate, formatCurrency } from '@/src/shared/utils/formatters';
import { OrderStatusBadge } from './OrderStatusBadge';
import { router } from 'expo-router';

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
                <ThemedText style={styles.orderNumber}>
                    Pedido #{order.orderNumber}
                </ThemedText>
                <OrderStatusBadge status={order.status} />
            </View>

            <View style={styles.content}>
                <View style={styles.infoRow}>
                    <ThemedText style={styles.label}>Fecha:</ThemedText>
                    <ThemedText style={styles.value}>{formatDate(order.date)}</ThemedText>
                </View>

                <View style={styles.infoRow}>
                    <ThemedText style={styles.label}>Productos:</ThemedText>
                    <ThemedText style={styles.value}>{order.items.length}</ThemedText>
                </View>

                <View style={styles.infoRow}>
                    <ThemedText style={styles.label}>Total:</ThemedText>
                    <ThemedText style={styles.total}>{formatCurrency(order.total)}</ThemedText>
                </View>
            </View>

            <View style={styles.footer}>
                <ThemedText style={styles.viewDetails}>Ver detalles</ThemedText>
                <Ionicons name="chevron-forward" size={20} color={colors.primary} />
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
        fontFamily: 'System',
        fontSize: 18,
        fontWeight: 'bold',
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
        fontFamily: 'System',
        fontSize: 15,
        color: colors.textSecondary,
    },
    value: {
        fontFamily: 'System',
        fontSize: 15,
    },
    total: {
        fontFamily: 'System',
        fontSize: 16,
        fontWeight: 'bold',
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
        fontFamily: 'System',
        fontSize: 14,
        fontWeight: '500',
        color: colors.primary,
        marginRight: 4,
    },
});