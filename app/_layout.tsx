import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SplashScreen } from 'expo-router';
import { Platform } from 'react-native';
import { AuthProvider } from '../src/shared/context/AuthContext';
import { useFrameworkReady } from '../src/shared/hooks/UseFrameworkReady';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    console.log('🚀 App layout mounted');
    console.log('🌐 Platform:', Platform.OS);
    console.log('🔧 DEV mode:', __DEV__);

    const timer = setTimeout(() => {
      console.log('🎬 Hiding splash screen');
      SplashScreen.hideAsync();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === 'ios' ? 'default' : 'fade',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </AuthProvider>
  );
}
