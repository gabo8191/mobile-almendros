import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { OrderStatus } from '../types/orders.types';
import { colors } from '@/constants/Colors';

type OrderStatusBadgeProps = {
    status: OrderStatus;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const getStatusColor = () => {
        switch (status) {
            case 'pending':
                return colors.statusPending;
            case 'processing':
                return colors.statusProcessing;
            case 'completed':
                return colors.statusCompleted;
            case 'cancelled':
                return colors.statusCancelled;
            default:
                return colors.textSecondary;
        }
    };

    const getStatusText = () => {
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

    const backgroundColor = `${getStatusColor()}20`; // 20% opacity

    return (
        <View style={[styles.container, { backgroundColor, borderColor: getStatusColor() }]}>
            <ThemedText style={[styles.text, { color: getStatusColor() }]}>
                {getStatusText()}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
    },
    text: {
        fontFamily: 'SF-Pro-Text-Medium',
        fontSize: 13,
    },
});