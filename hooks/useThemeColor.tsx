import { useColorScheme } from './useColorScheme';

const Colors = {
    light: {
        text: '#000',
        background: '#fff',
        tint: '#228B22', // Forest green
        tabIconDefault: '#ccc',
        tabIconSelected: '#228B22',
        icon: '#000',
    },
    dark: {
        text: '#fff',
        background: '#000',
        tint: '#228B22',
        tabIconDefault: '#ccc',
        tabIconSelected: '#228B22',
        icon: '#fff',
    },
};

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
    const theme = useColorScheme();
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}