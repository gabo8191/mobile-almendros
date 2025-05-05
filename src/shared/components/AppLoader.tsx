import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { colors } from '../../constants/Colors';

type AppLoaderProps = {
    message?: string;
};

export const AppLoader: React.FC<AppLoaderProps> = ({ message }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
    message: {
        marginTop: 12,
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },
});