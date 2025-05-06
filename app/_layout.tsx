import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { Platform } from 'react-native';
import { AuthProvider } from '../src/shared/context/AuthContext';
import { useFrameworkReady } from '../src/shared/hooks/UseFrameworkReady';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'SF-Pro-Display-Medium': require('../assets/fonts/SF-Pro-Display-Medium.otf'),
    'SF-Pro-Display-Regular': require('../assets/fonts/SF-Pro-Display-Regular.otf'),
    'SF-Pro-Display-Bold': require('../assets/fonts/SF-Pro-Display-Bold.otf'),
    'SF-Pro-Text-Regular': require('../assets/fonts/SF-Pro-Text-Regular.otf'),
    'SF-Pro-Text-Medium': require('../assets/fonts/SF-Pro-Text-Medium.otf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'default' : 'fade',
      }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </AuthProvider>
  );
}