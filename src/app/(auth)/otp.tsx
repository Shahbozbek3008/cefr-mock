import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, RotateCcw } from 'lucide-react-native';
import {
  OTP_LENGTH,
  PHONE_PREFIX,
  RESEND_SECONDS,
  authErrorKey,
  formatCountdown,
  formatPhone,
  requestCode,
  useCountdown,
  verifyCode,
} from '@/features/auth/model';
import { OtpField } from '@/features/auth/ui/OtpField';
import { useI18n } from '@/shared/i18n';
import { hitSlop, useTheme } from '@/shared/theme';
import { IconButton, Screen, Text, useToast } from '@/shared/ui';

export default function OtpScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const params = useLocalSearchParams<{ phone?: string }>();
  const phone = params.phone ?? '';
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const { remaining, restart, finished } = useCountdown(RESEND_SECONDS);
  const showToast = useToast((s) => s.show);

  const showError = useCallback(
    (error: unknown) => showToast({ message: t(authErrorKey(error)), tone: 'error' }),
    [showToast, t],
  );

  const verify = useCallback(
    async (value: string) => {
      setVerifying(true);
      try {
        const { needsName } = await verifyCode(phone, value);
        router.replace(needsName ? '/(auth)/name' : '/(tabs)/home');
      } catch (error) {
        setCode('');
        setVerifying(false);
        showError(error);
      }
    },
    [phone, showError],
  );

  const resend = useCallback(async () => {
    restart();
    try {
      await requestCode(phone);
    } catch (error) {
      showError(error);
    }
  }, [phone, restart, showError]);

  useEffect(() => {
    if (code.length === OTP_LENGTH && !verifying) verify(code);
  }, [code, verify, verifying]);

  return (
    <Screen paddingHorizontal={24}>
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <View style={styles.topBar}>
          <IconButton accessibilityLabel={t('common.back')} onPress={router.back} style={styles.back}>
            <ChevronLeft size={17} color={colors.textStrong} strokeWidth={1.6} />
          </IconButton>
        </View>

        <View style={styles.content}>
          <View style={styles.intro}>
            <Text variant="titleXl">{t('auth.otpTitle')}</Text>
            <Text variant="labelRelaxed" color={colors.textSecondary}>
              {t('auth.otpSentPrefix')} <Text variant="monoField">{`${PHONE_PREFIX} ${formatPhone(phone)}`}</Text>
              {t('auth.otpSentSuffix') ? ` ${t('auth.otpSentSuffix')}` : '.'}{' '}
              <Text variant="labelMedium" color={colors.link} onPress={router.back}>
                {t('auth.change')}
              </Text>
            </Text>
          </View>

          <View pointerEvents={verifying ? 'none' : 'auto'} style={verifying && styles.dimmed}>
            <OtpField value={code} onChange={setCode} />
          </View>

          {verifying ? (
            <ActivityIndicator color={colors.textSecondary} style={styles.resend} />
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !finished }}
              disabled={!finished}
              hitSlop={hitSlop}
              onPress={resend}
              style={styles.resend}
            >
              <RotateCcw size={15} color={colors.textSecondary} strokeWidth={1.6} />
              <Text variant="bodySm" color={colors.textSecondary}>
                {t('auth.resend')}
              </Text>
              {finished ? null : (
                <Text variant="monoSm" color={colors.text}>
                  {formatCountdown(remaining)}
                </Text>
              )}
            </Pressable>
          )}
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
    alignSelf: 'flex-start',
    gap: 8,
    height: 44,
  },
  dimmed: {
    opacity: 0.5,
  },
});
