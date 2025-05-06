import { Platform } from 'react-native';

export const typography = {
  // Font families
  fontFamily: {
    // Primary serif font for headings and emphasis
    serif: Platform.select({
      ios: 'Palatino',
      android: 'serif',
      default: 'Palatino',
    }),
    // Sans serif font for body text and UI elements
    sans: Platform.select({
      ios: 'Avenir-Medium',
      android: 'sans-serif',
      default: 'Avenir-Medium',
    }),
    // Light weight sans serif
    sansLight: Platform.select({
      ios: 'Avenir-Light',
      android: 'sans-serif-light',
      default: 'Avenir-Light',
    }),
    // Bold sans serif
    sansBold: Platform.select({
      ios: 'Avenir-Heavy',
      android: 'sans-serif-medium',
      default: 'Avenir-Heavy',
    }),
  },

  // Font styles for different text elements
  styles: {
    // Main app title (Almendros)
    title: Platform.select({
      ios: {
        fontFamily: 'Palatino',
        fontWeight: 'bold',
        letterSpacing: -0.5,
      },
      android: {
        fontFamily: 'serif',
        fontWeight: 'bold',
        letterSpacing: -0.5,
      },
      default: {
        fontFamily: 'Palatino',
        fontWeight: 'bold',
        letterSpacing: -0.5,
      },
    }),

    // Section headings (like "Mi Perfil", "Mis Pedidos")
    heading: Platform.select({
      ios: {
        fontFamily: 'Avenir-Heavy',
        fontWeight: '600',
      },
      android: {
        fontFamily: 'sans-serif-medium',
        fontWeight: '600',
      },
      default: {
        fontFamily: 'Avenir-Heavy',
        fontWeight: '600',
      },
    }),

    // Subheadings (like "Inicie sesión para ver sus pedidos")
    subheading: Platform.select({
      ios: {
        fontFamily: 'Avenir-Medium',
        fontWeight: '500',
      },
      android: {
        fontFamily: 'sans-serif',
        fontWeight: '500',
      },
      default: {
        fontFamily: 'Avenir-Medium',
        fontWeight: '500',
      },
    }),

    // Regular body text
    body: Platform.select({
      ios: {
        fontFamily: 'Avenir-Book',
        fontWeight: 'normal',
      },
      android: {
        fontFamily: 'sans-serif',
        fontWeight: 'normal',
      },
      default: {
        fontFamily: 'Avenir-Book',
        fontWeight: 'normal',
      },
    }),

    // Button text
    button: Platform.select({
      ios: {
        fontFamily: 'Avenir-Medium',
        fontWeight: '500',
      },
      android: {
        fontFamily: 'sans-serif-medium',
        fontWeight: '500',
      },
      default: {
        fontFamily: 'Avenir-Medium',
        fontWeight: '500',
      },
    }),

    // Small captions and labels
    caption: Platform.select({
      ios: {
        fontFamily: 'Avenir-Light',
        fontWeight: 'normal',
      },
      android: {
        fontFamily: 'sans-serif-light',
        fontWeight: 'normal',
      },
      default: {
        fontFamily: 'Avenir-Light',
        fontWeight: 'normal',
      },
    }),
  },

  // Font sizes
  sizes: {
    h1: 36,      // Main app title (Almendros)
    h2: 30,      // Screen headers
    h3: 24,      // Section headers
    h4: 20,      // Subsection headers
    body: 16,    // Regular text
    button: 18,  // Button text
    caption: 14, // Secondary text
    small: 12,   // Tertiary text
  },

  // Line heights
  lineHeights: {
    h1: 1.2,     // Tighter for headings
    h2: 1.2,
    h3: 1.3,
    h4: 1.3,
    body: 1.5,   // More spacious for body text
    button: 1.3,
    caption: 1.4,
  }
};