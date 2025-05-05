import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { colors } from '@/constants/Colors';

type EmptyStateProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
};

export function EmptyState({ icon, title, description }: EmptyStateProps) {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>{icon}</View>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <ThemedText style={styles.description}>{description}</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontFamily: 'System',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        fontFamily: 'System',
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});