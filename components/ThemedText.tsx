import { Text, TextProps } from 'react-native';
import { useColorScheme } from 'react-native';

export function ThemedText(props: TextProps) {
  const colorScheme = useColorScheme();

  return (
    <Text
      {...props}
      style={[
        {
          color: colorScheme === 'dark' ? '#fff' : '#000',
        },
        props.style,
      ]}
    />
  );
}