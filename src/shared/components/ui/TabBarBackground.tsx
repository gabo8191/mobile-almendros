import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../../../constants/Colors';

export function TabBarBackground() {
    if (Platform.OS === 'ios') {
        return (
            <BlurView
                tint="light"
                intensity={95}
                style={[StyleSheet.absoluteFill, styles.iosBlur]}
            />
        );
    }

    return <View style={[StyleSheet.absoluteFill, styles.androidBackground]} />;
}

const styles = StyleSheet.create({
    iosBlur: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    androidBackground: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: colors.divider,
    }
});