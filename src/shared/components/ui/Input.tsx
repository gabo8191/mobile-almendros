import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/constants/Colors';

type InputProps = TextInputProps & {
    label?: string;
    error?: string;
    containerStyle?: StyleProp<ViewStyle>;
};

export function Input({
    label,
    error,
    secureTextEntry,
    containerStyle,
    value,
    onChangeText,
    ...rest
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isSecure = secureTextEntry && !isPasswordVisible;

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={[
                styles.inputContainer,
                isFocused && styles.inputFocused,
                error && styles.inputError
            ]}>
                <TextInput
                    style={styles.input}
                    secureTextEntry={isSecure}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholderTextColor="#A5A5A7"
                    {...rest}
                />

                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={togglePasswordVisibility}
                        style={styles.eyeIcon}
                    >
                        {isPasswordVisible ? (
                            <Ionicons name="eye-off" size={20} color={colors.textSecondary} />
                        ) : (
                            <Ionicons name="eye" size={20} color={colors.textSecondary} />
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontFamily: 'System',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: colors.text,
    },
    inputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#D1D1D6',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontFamily: 'System',
        fontSize: 16,
        color: colors.text,
    },
    inputFocused: {
        borderColor: colors.primary,
    },
    inputError: {
        borderColor: colors.error,
    },
    eyeIcon: {
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontFamily: 'System',
        fontSize: 14,
        color: colors.error,
        marginTop: 6,
    },
});