import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

export function TabBarBackground() {
    if (Platform.OS === 'ios') {
        return (
            <BlurView
                tint="light"
                intensity={95}
                style={StyleSheet.absoluteFill}
            />
        );
    }

    return <View style={[StyleSheet.absoluteFill, { backgroundColor: '#fff' }]} />;
}