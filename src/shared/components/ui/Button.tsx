import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/src/constants/Colors';

type ButtonProps = {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'outline' | 'secondary';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
};

export function Button({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    fullWidth = false,
    style,
    textStyle,
}: ButtonProps) {
    // Get button styles based on variant
    const getButtonStyles = () => {
        switch (variant) {
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderColor: colors.primary,
                    borderWidth: 1,
                };
            case 'secondary':
                return {
                    backgroundColor: '#F2F2F7',
                };
            default:
                return {
                    backgroundColor: colors.primary,
                };
        }
    };

    // Get text color based on variant
    const getTextColor = () => {
        switch (variant) {
            case 'outline':
                return colors.primary;
            case 'secondary':
                return colors.text;
            default:
                return '#FFFFFF';
        }
    };

    const buttonStyles = getButtonStyles();
    const textColor = getTextColor();
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                buttonStyles,
                fullWidth && styles.fullWidth,
                isDisabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : colors.primary} />
            ) : (
                <Text
                    style={[
                        styles.buttonText,
                        { color: textColor },
                        isDisabled && styles.disabledText,
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'System',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
    disabledText: {
        opacity: 0.7,
    },
});