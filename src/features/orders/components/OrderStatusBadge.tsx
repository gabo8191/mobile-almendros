import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { OrderStatus } from '../types/orders.types';
import { colors } from '@/src/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { typography } from '@/src/constants/Typography';

type OrderStatusBadgeProps = {
    status: OrderStatus;
    size?: 'small' | 'medium' | 'large';
};

export function OrderStatusBadge({ status, size = 'medium' }: OrderStatusBadgeProps) {
    const getStatusConfig = () => {
        switch (status) {
            case 'pending':
                return {
                    color: colors.statusPending,
                    text: 'Pendiente',
                    icon: 'clock'
                };
            case 'processing':
                return {
                    color: colors.statusProcessing,
                    text: 'Procesando',
                    icon: 'refresh-cw'
                };
            case 'completed':
                return {
                    color: colors.statusCompleted,
                    text: 'Completado',
                    icon: 'check-circle'
                };
            case 'cancelled':
                return {
                    color: colors.statusCancelled,
                    text: 'Cancelado',
                    icon: 'x-circle'
                };
            default:
                return {
                    color: colors.textSecondary,
                    text: 'Desconocido',
                    icon: 'help-circle'
                };
        }
    };

    const { color, text, icon } = getStatusConfig();
    const backgroundColor = `${color}15`; // 15% opacity

    // Size variations
    const iconSize = size === 'small' ? 12 : size === 'medium' ? 14 : 16;
    const fontSize = size === 'small' ? typography.sizes.small : size === 'medium' ? typography.sizes.caption : typography.sizes.body;
    const paddingHorizontal = size === 'small' ? 8 : size === 'medium' ? 10 : 12;
    const paddingVertical = size === 'small' ? 3 : size === 'medium' ? 4 : 6;

    return (
        <View style={[
            styles.container,
            {
                backgroundColor,
                borderColor: color,
                paddingHorizontal,
                paddingVertical
            }
        ]}>
            <Feather
                name={icon as any}
                size={iconSize}
                color={color}
                style={styles.icon}
            />
            <ThemedText style={[
                styles.text,
                {
                    color,
                    fontSize
                }
            ]}>
                {text}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
    },
    icon: {
        marginRight: 4,
    },
    text: {
        fontFamily: typography.fontFamily.sansBold,
    },
});