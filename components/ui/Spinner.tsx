import React from 'react';
import { ActivityIndicator, View, StyleSheet, ActivityIndicatorProps } from 'react-native';
import { colors } from '@/constants/Colors';

type SpinnerProps = ActivityIndicatorProps & {
    fullscreen?: boolean;
};

export function Spinner({ size = 'small', color = colors.primary, fullscreen = false, ...rest }: SpinnerProps) {
    if (fullscreen) {
        return (
            <View style={styles.fullscreenContainer}>
                <ActivityIndicator size={size} color={color} {...rest} />
            </View>
        );
    }

    return <ActivityIndicator size={size} color={color} {...rest} />;
}

const styles = StyleSheet.create({
    fullscreenContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 999,
    },
});