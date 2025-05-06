import { Platform } from 'react-native';

// Definición de fuentes serif del sistema para iOS y Android
export const typography = {
    // Fuentes para títulos grandes (como "Almendros")
    titleFont: Platform.select({
        ios: {
            fontFamily: 'Times New Roman',
            fontWeight: 'bold', // Valor válido en vez de '700'
        },
        android: {
            fontFamily: 'serif',
            fontWeight: 'bold', // Valor válido en vez de '700'
        },
        default: {
            fontFamily: 'Times New Roman',
            fontWeight: 'bold',
        },
    }),

    // Fuentes para subtítulos (como "Inicie sesión para ver sus pedidos")
    subtitleFont: Platform.select({
        ios: {
            fontFamily: 'Times New Roman',
            fontWeight: 'normal', // Valor válido en vez de '400'
        },
        android: {
            fontFamily: 'serif',
            fontWeight: 'normal',
        },
        default: {
            fontFamily: 'Times New Roman',
            fontWeight: 'normal',
        },
    }),

    // Fuentes para texto regular y inputs
    bodyFont: Platform.select({
        ios: {
            fontFamily: 'Georgia',
            fontWeight: 'normal', // Valor válido en vez de '400'
        },
        android: {
            fontFamily: 'serif',
            fontWeight: 'normal',
        },
        default: {
            fontFamily: 'Georgia',
            fontWeight: 'normal',
        },
    }),

    // Fuentes para textos pequeños (como "¿Olvidó su contraseña?")
    captionFont: Platform.select({
        ios: {
            fontFamily: 'Georgia',
            fontWeight: 'normal',
        },
        android: {
            fontFamily: 'serif',
            fontWeight: 'normal',
        },
        default: {
            fontFamily: 'Georgia',
            fontWeight: 'normal',
        },
    }),

    // Fuentes para botones (como "Iniciar Sesión")
    buttonFont: Platform.select({
        ios: {
            fontFamily: 'Georgia',
            fontWeight: 'medium', // Valor válido
        },
        android: {
            fontFamily: 'serif-medium',
            fontWeight: 'normal',
        },
        default: {
            fontFamily: 'Georgia',
            fontWeight: 'normal',
        },
    }),

    // Tamaños de fuente
    sizes: {
        h1: 34,      // Título principal (Almendros)
        h2: 28,      // Subtítulos grandes
        h3: 22,      // Subtítulos medianos
        h4: 18,      // Subtítulos pequeños
        body: 16,    // Texto normal
        button: 16,  // Texto de botones
        caption: 14, // Textos secundarios
        small: 12,   // Textos muy pequeños
    },

    // Espaciado entre líneas
    lineHeights: {
        h1: 1.2,     // Más compacto para títulos
        h2: 1.3,
        body: 1.5,   // Más espaciado para texto normal
    }
};