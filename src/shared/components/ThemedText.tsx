import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { useThemeColor } from '@/src/shared/hooks/useThemeColor';
import { typography } from '@/src/constants/Typography';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'subtitle' | 'defaultSemiBold' | 'link' | 'caption' | 'button' | 'heading';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'button' ? styles.button : undefined,
        type === 'heading' ? styles.heading : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create<Record<string, TextStyle>>({
  default: {
    fontFamily: typography.bodyFont.fontFamily,
    fontWeight: typography.bodyFont.fontWeight as TextStyle['fontWeight'],
    fontSize: typography.sizes.body,
    lineHeight: typography.sizes.body * typography.lineHeights.body,
  },
  defaultSemiBold: {
    fontFamily: typography.subtitleFont.fontFamily,
    fontWeight: typography.subtitleFont.fontWeight as TextStyle['fontWeight'],
    fontSize: typography.sizes.body,
    lineHeight: typography.sizes.body * typography.lineHeights.body,
  },
  title: {
    fontFamily: typography.titleFont.fontFamily,
    fontWeight: typography.titleFont.fontWeight as TextStyle['fontWeight'],
    fontSize: typography.sizes.h1,
    lineHeight: typography.sizes.h1 * typography.lineHeights.h1,
    letterSpacing: -0.5, // Ajuste fino para similar a la web
  },
  subtitle: {
    fontFamily: typography.subtitleFont.fontFamily,
    fontWeight: typography.subtitleFont.fontWeight as TextStyle['fontWeight'],
    fontSize: typography.sizes.h3,
    lineHeight: typography.sizes.h3 * typography.lineHeights.h2,
    color: '#30642B',
  },
  heading: {
    fontFamily: typography.subtitleFont.fontFamily,
    fontWeight: typography.subtitleFont.fontWeight as TextStyle['fontWeight'],
    fontSize: typography.sizes.h4,
    lineHeight: typography.sizes.h4 * typography.lineHeights.h2,
    color: '#30642B',
  },
  link: {
    fontFamily: typography.bodyFont.fontFamily,
    fontWeight: typography.bodyFont.fontWeight as TextStyle['fontWeight'],
    fontSize: typography.sizes.body,
    lineHeight: typography.sizes.body * typography.lineHeights.body,
    color: '#30642B',
    textDecorationLine: 'none',
  },
  caption: {
    fontFamily: typography.captionFont.fontFamily,
    fontWeight: typography.captionFont.fontWeight as TextStyle['fontWeight'],
    fontSize: typography.sizes.caption,
    lineHeight: typography.sizes.caption * typography.lineHeights.body,
    color: '#30642B',
  },
  button: {
    fontFamily: typography.buttonFont.fontFamily,
    fontWeight: typography.buttonFont.fontWeight as TextStyle['fontWeight'],
    fontSize: typography.sizes.button,
    lineHeight: typography.sizes.button * typography.lineHeights.body,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});