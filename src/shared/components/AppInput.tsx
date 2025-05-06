import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { colors } from '../../constants/Colors';
import { Eye, EyeOff } from '@expo/vector-icons/Feather';

type AppInputProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
    error?: string;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    maxLength?: number;
};

export function AppInput({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
    error,
    autoCapitalize = 'none',
    maxLength,
}: AppInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={styles.container}>
            <ThemedText style={styles.label}>{label}</ThemedText>
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.focusedInput,
                    error && styles.errorInput,
                ]}
            >
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#8E8E93"
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    maxLength={maxLength}
                />
                {secureTextEntry && (
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeButton}>
                        {isPasswordVisible ? (
                            <EyeOff size={20} color="#8E8E93" />
                        ) : (
                            <Eye size={20} color="#8E8E93" />
                        )}
                    </TouchableOpacity>
                )}
            </View>
            {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontFamily: 'SF-Pro-Text-Medium',
        fontSize: 16,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        fontFamily: 'SF-Pro-Text-Regular',
        fontSize: 16,
        paddingVertical: 14,
        color: '#000',
    },
    focusedInput: {
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    errorInput: {
        borderColor: colors.error,
    },
    errorText: {
        fontFamily: 'SF-Pro-Text-Regular',
        fontSize: 14,
        color: colors.error,
        marginTop: 6,
    },
    eyeButton: {
        justifyContent: 'center',
        paddingLeft: 12,
    },
});