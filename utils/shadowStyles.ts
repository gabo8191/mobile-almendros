import { Platform, StyleSheet } from 'react-native';

export function createShadowStyle(
    elevation: number = 2,
    shadowColor: string = '#000',
    shadowOffset: { width: number; height: number } = { width: 0, height: 2 },
    shadowOpacity: number = 0.1,
    shadowRadius: number = 3
) {
    if (Platform.OS === 'web') {
        // Para web, usamos boxShadow
        return {
            boxShadow: `0px ${shadowOffset.height}px ${shadowRadius}px rgba(0, 0, 0, ${shadowOpacity})`,
        };
    } else {
        // Para móvil, usamos las propiedades nativas
        return {
            elevation,
            shadowColor,
            shadowOffset,
            shadowOpacity,
            shadowRadius,
        };
    }
}