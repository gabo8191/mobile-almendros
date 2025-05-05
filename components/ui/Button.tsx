import { TouchableOpacity, StyleSheet, ActivityIndicator, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { colors } from '@/constants/Colors';

type ButtonProps = {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: any;
};

export function Button({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    fullWidth = false,
    style,
}: ButtonProps) {
    const buttonStyles = [
        styles.button,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'outline' && styles.outlineButton,
        disabled && styles.disabledButton,
        fullWidth && styles.fullWidth,
        style,
    ];

    const textStyles = [
        styles.text,
        variant === 'primary' && styles.primaryText,
        variant === 'secondary' && styles.secondaryText,
        variant === 'outline' && styles.outlineText,
        disabled && styles.disabledText,
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? colors.primary : '#fff'} />
            ) : (
                <ThemedText style={textStyles}>{title}</ThemedText>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    primaryButton: {
        backgroundColor: colors.primary,
    },
    secondaryButton: {
        backgroundColor: 'rgba(34, 139, 34, 0.1)',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    disabledButton: {
        backgroundColor: '#E5E5EA',
        borderColor: '#E5E5EA',
    },
    fullWidth: {
        width: '100%',
    },
    text: {
        fontSize: 16,
        fontFamily: 'SF-Pro-Text-Medium',
    },
    primaryText: {
        color: '#fff',
    },
    secondaryText: {
        color: colors.primary,
    },
    outlineText: {
        color: colors.primary,
    },
    disabledText: {
        color: '#8E8E93',
    },
});