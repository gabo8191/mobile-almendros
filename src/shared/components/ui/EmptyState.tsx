import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ThemedText } from '../ThemedText';
import { colors } from '../../../constants/Colors';
import { typography } from '../../../constants/Typography';

type EmptyStateProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    imageUrl?: any; // Optional image to show instead of icon
};

export function EmptyState({ icon, title, description, imageUrl }: EmptyStateProps) {
    return (
        <View style={styles.container}>
            {imageUrl ? (
                <Image source={imageUrl} style={styles.image} resizeMode="contain" />
            ) : (
                <View style={styles.iconContainer}>{icon}</View>
            )}
            <ThemedText style={styles.title}>{title}</ThemedText>
            <ThemedText style={styles.description}>{description}</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: `${colors.primary}10`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    image: {
        width: 200,
        height: 160,
        marginBottom: 24,
    },
    title: {
        fontFamily: typography.fontFamily.sansBold,
        fontSize: typography.sizes.h3,
        color: colors.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontFamily: typography.fontFamily.sans,
        fontSize: typography.sizes.body,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
});