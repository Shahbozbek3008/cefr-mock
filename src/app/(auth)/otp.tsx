import { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, RotateCcw } from 'lucide-react-native';
import { useUserStore } from '@/entities/user/model';
import {
  OTP_LENGTH,
  PHONE_PREFIX,
  RESEND_SECONDS,
  formatCountdown,
  formatPhone,
  useCountdown,
} from '@/features/auth/model';
import { OtpField } from '@/features/auth/ui/OtpField';
import { hitSlop, useTheme } from '@/shared/theme';
import { IconButton, Screen, Text } from '@/shared/ui';

export default function OtpScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ phone?: string }>();
  const phone = params.phone ?? '';
  const [code, setCode] = useState('');
  const { remaining, restart, finished } = useCountdown(RESEND_SECONDS);
  const setUser = useUserStore((state) => state.setUser);

  const onVerified = useCallback(() => {
    setUser({
      id: 'local',
      name: 'Aziza Karimova',
      phone: `${PHONE_PREFIX}${phone}`,
      isPro: false,
    });
    router.replace('/(tabs)/home');
  }, [phone, setUser]);

  useEffect(() => {
    if (code.length === OTP_LENGTH) onVerified();
  }, [code, onVerified]);

  return (
    <Screen paddingHorizontal={24}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.topBar}>
          <IconButton accessibilityLabel="Orqaga" onPress={router.back} style={styles.back}>
            <ChevronLeft size={17} color={colors.textStrong} strokeWidth={1.6} />
          </IconButton>
        </View>

        <View style={styles.content}>
          <View style={styles.intro}>
            <Text variant="titleXl">Kodni kiriting</Text>
            <Text variant="labelRelaxed" color={colors.textSecondary}>
              6 xonali kod <Text variant="monoField">{`${PHONE_PREFIX} ${formatPhone(phone)}`}</Text> raqamiga
              yuborildi.{' '}
              <Text variant="labelMedium" color={colors.link} onPress={router.back}>
                O'zgartirish
              </Text>
            </Text>
          </View>

          <OtpField value={code} onChange={setCode} />

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !finished }}
            disabled={!finished}
            hitSlop={hitSlop}
            onPress={restart}
            style={styles.resend}
          >
            <RotateCcw size={15} color={colors.textSecondary} strokeWidth={1.6} />
            <Text variant="bodySm" color={colors.textSecondary}>
              Qayta yuborish
            </Text>
            {finished ? null : (
              <Text variant="monoSm" color={colors.text}>
                {formatCountdown(remaining)}
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  topBar: {
    height: 44,
    justifyContent: 'center',
  },
  back: {
    marginLeft: -4,
  },
  content: {
    flex: 1,
    gap: 32,
    paddingTop: 32,
  },
  intro: {
    gap: 10,
  },
  resend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
  },
});
