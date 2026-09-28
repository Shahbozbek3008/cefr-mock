import { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthListener } from '@/features/auth/model';
import { ThemeTransitionProvider } from '@/features/theme-switch/ui/ThemeTransitionProvider';
import { useI18n } from '@/shared/i18n';
import { isSupabaseConfigured } from '@/shared/api';
import { fontAssets } from '@/shared/config/fonts';
import { queryClient } from '@/shared/lib';
import { useTheme } from '@/shared/theme';
import { Screen, StateView, ToastHost } from '@/shared/ui';

SplashScreen.preventAutoHideAsync();

const ConfigMissing = () => {
  const { t } = useI18n();
  return (
    <Screen>
      <StateView tone="error" title={t('common.configMissingTitle')} message={t('common.configMissingMessage')} />
    </Screen>
  );
};

export default function RootLayout() {
  const { colors, scheme } = useTheme();
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  useAuthListener();

  const onReady = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) onReady();
  }, [fontsLoaded, fontError, onReady]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.bg);
  }, [colors.bg]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeTransitionProvider>
              <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
              {isSupabaseConfigured ? (
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.bg },
                    animation: 'slide_from_right',
                  }}
                >
                  <Stack.Screen name="test/[id]/[section]" options={{ gestureEnabled: false, animation: 'fade' }} />
                  <Stack.Screen name="subscription" options={{ animation: 'slide_from_bottom' }} />
                </Stack>
              ) : (
                <ConfigMissing />
              )}
              <ToastHost />
            </ThemeTransitionProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
