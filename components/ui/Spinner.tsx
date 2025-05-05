import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '@/constants/Colors';

type SpinnerProps = {
    size?: 'small' | 'large';
    color?: string;
};

export function Spinner({ size = 'small', color = colors.primary }: SpinnerProps) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});