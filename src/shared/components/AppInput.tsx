import React from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TextInputProps
} from 'react-native';
import { colors } from '../../constants/Colors';

type AppInputProps = TextInputProps & {
    label?: string;
    error?: string;
    fullWidth?: boolean;
};

export const AppInput: React.FC<AppInputProps> = ({
    label,
    error,
    fullWidth = false,
    style,
    ...rest
}) => {
    return (
        <View style={[styles.container, fullWidth && styles.fullWidth]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    error ? styles.inputError : null,
                    style,
                ]}
                placeholderTextColor="#999"
                {...rest}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    fullWidth: {
        width: '100%',
    },
    label: {
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    input: {
        height: 48,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#333',
    },
    inputError: {
        borderColor: colors.error,
    },
    errorText: {
        marginTop: 4,
        fontSize: 12,
        color: colors.error,
    },
});