import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, TextStyle, ViewStyle } from 'react-native';
import { ThemedText } from './ThemedText';
import { colors } from '../../constants/Colors';
import { typography } from '../../constants/Typography';

type AppButtonProps = {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: any;
};

export function AppButton({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    fullWidth = true,
    style,
}: AppButtonProps) {
    const buttonStyles = [
        styles.button,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'outline' && styles.outlineButton,
        disabled && styles.disabledButton,
        fullWidth && styles.fullWidth,
        style,
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
                <ThemedText type="button" style={styles.buttonTextBase}>
                    {title}
                </ThemedText>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 0,
        shadowOpacity: 0,
    } as ViewStyle,
    primaryButton: {
        backgroundColor: '#228B22',
    } as ViewStyle,
    secondaryButton: {
        backgroundColor: 'rgba(34, 139, 34, 0.1)',
    } as ViewStyle,
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    } as ViewStyle,
    disabledButton: {
        backgroundColor: '#E5E5EA',
        borderColor: '#E5E5EA',
    } as ViewStyle,
    fullWidth: {
        width: '100%',
    } as ViewStyle,
    // Estilo base para el texto del botón
    buttonTextBase: {
        color: '#fff', // Por defecto blanco para botón primario
        fontSize: typography.sizes.button,
    } as TextStyle,
});