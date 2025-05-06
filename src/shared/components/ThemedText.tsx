import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { useThemeColor } from '@/src/shared/hooks/useThemeColor';
import { typography } from '@/src/constants/Typography';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'subtitle' | 'heading' | 'subheading' | 'defaultSemiBold' | 'link' | 'caption' | 'button' | 'small';
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
        styles[type] || styles.default,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create<Record<string, TextStyle>>({
  default: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.sizes.body,
    lineHeight: typography.sizes.body * typography.lineHeights.body,
  },

  defaultSemiBold: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.body,
    lineHeight: typography.sizes.body * typography.lineHeights.body,
  },

  title: {
    fontFamily: typography.fontFamily.serif,
    fontSize: typography.sizes.h1,
    lineHeight: typography.sizes.h1 * typography.lineHeights.h1,
    letterSpacing: -0.5,
    color: '#000',
  },

  subtitle: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.sizes.h3,
    lineHeight: typography.sizes.h3 * typography.lineHeights.h3,
    color: '#2E7D32',
  },

  heading: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.h2,
    lineHeight: typography.sizes.h2 * typography.lineHeights.h2,
    letterSpacing: -0.3,
  },

  subheading: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.h4,
    lineHeight: typography.sizes.h4 * typography.lineHeights.h3,
    color: '#2E7D32',
  },

  link: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.sizes.body,
    lineHeight: typography.sizes.body * typography.lineHeights.body,
    color: '#2E7D32',
    textDecorationLine: 'none',
  },

  caption: {
    fontFamily: typography.fontFamily.sansLight,
    fontSize: typography.sizes.caption,
    lineHeight: typography.sizes.caption * typography.lineHeights.caption,
    color: '#546E7A',
  },

  button: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.button,
    lineHeight: typography.sizes.button * typography.lineHeights.button,
    letterSpacing: 0.3,
  },

  small: {
    fontFamily: typography.fontFamily.sansLight,
    fontSize: typography.sizes.small,
    lineHeight: typography.sizes.small * typography.lineHeights.caption,
    color: '#78909C',
  },
});