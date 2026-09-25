import { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { fontAssets } from '@/shared/config/fonts';
import { queryClient } from '@/shared/lib';
import { light } from '@/shared/theme';
import { ToastHost } from '@/shared/ui';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  const onReady = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) onReady();
  }, [fontsLoaded, fontError, onReady]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <View style={styles.root}>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: styles.content,
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="test/[id]/[section]" options={{ gestureEnabled: false, animation: 'fade' }} />
              <Stack.Screen name="subscription" options={{ animation: 'slide_from_bottom' }} />
            </Stack>
            <ToastHost />
          </View>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { backgroundColor: light.bg },
});
