import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { OrderItem } from '../types/orders.types';
import { formatCurrency } from '@/src/shared/utils/formatters';
import { colors } from '@/src/constants/Colors';

type OrderItemRowProps = {
    item: OrderItem;
};

export function OrderItemRow({ item }: OrderItemRowProps) {
    const itemTotal = item.price * item.quantity;

    return (
        <View style={styles.container}>
            <View style={styles.itemInfo}>
                <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                <ThemedText style={styles.itemQuantity}>x{item.quantity}</ThemedText>
            </View>
            <View style={styles.itemPriceContainer}>
                <ThemedText style={styles.itemPrice}>{formatCurrency(itemTotal)}</ThemedText>
                <ThemedText style={styles.itemUnitPrice}>({formatCurrency(item.price)} c/u)</ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontFamily: 'System',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    itemQuantity: {
        fontFamily: 'System',
        fontSize: 14,
        color: colors.textSecondary,
    },
    itemPriceContainer: {
        alignItems: 'flex-end',
    },
    itemPrice: {
        fontFamily: 'System',
        fontSize: 16,
        fontWeight: '500',
    },
    itemUnitPrice: {
        fontFamily: 'System',
        fontSize: 13,
        color: colors.textSecondary,
    },
});