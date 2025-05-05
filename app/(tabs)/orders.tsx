import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { useOrders } from '@/src/features/orders/hooks/useOrders';
import { OrderCard } from '@/src/features/orders/components/OrderCard';
import { Spinner } from '@/src/shared/components/ui/Spinner';
import { colors } from '@/src/constants/Colors';

export default function OrdersScreen() {
    const { orders, loading, error, refreshing, refreshOrders } = useOrders();

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <Spinner size="large" />
            </View>
        );
    }

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color={colors.textSecondary} />
            <ThemedText style={styles.emptyText}>No tiene pedidos</ThemedText>
            <ThemedText style={styles.emptySubtext}>
                Los pedidos que realice aparecerán aquí
            </ThemedText>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <ThemedText style={styles.title}>Mis Pedidos</ThemedText>
            </View>

            {error ? (
                <View style={styles.errorContainer}>
                    <ThemedText style={styles.errorText}>{error}</ThemedText>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <OrderCard order={item} />}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={renderEmptyList}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={refreshOrders}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 12 : 56,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    title: {
        fontFamily: 'System',
        fontSize: 34,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },
    separator: {
        height: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontFamily: 'System',
        fontSize: 18,
        fontWeight: '500',
        color: colors.textSecondary,
        marginTop: 16,
    },
    emptySubtext: {
        fontFamily: 'System',
        fontSize: 15,
        color: colors.textTertiary,
        marginTop: 8,
    },
    errorContainer: {
        margin: 16,
        padding: 16,
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        borderRadius: 12,
        alignItems: 'center',
    },
    errorText: {
        fontFamily: 'System',
        fontSize: 15,
        color: colors.error,
        textAlign: 'center',
    },
});