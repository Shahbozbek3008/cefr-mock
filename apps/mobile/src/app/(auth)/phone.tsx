import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { authErrorKey, isPhoneComplete, requestCode } from '@/features/auth/model';
import { PhoneField } from '@/features/auth/ui/PhoneField';
import { SocialButton } from '@/features/auth/ui/SocialButton';
import { useI18n } from '@/shared/i18n';
import { errorCode } from '@/shared/api';
import { AppleIcon, GoogleIcon } from '@/shared/icons';
import { makeStyles, radius, useTheme } from '@/shared/theme';
import { Button, HeroSurface, Screen, Text, useToast } from '@/shared/ui';

export default function PhoneScreen() {
  const styles = useStyles();
  const { colors, elevation } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [digits, setDigits] = useState('');
  const [sending, setSending] = useState(false);

  const complete = isPhoneComplete(digits);
  const showToast = useToast((s) => s.show);

  const soon = useCallback(() => showToast({ message: t('common.comingSoon') }), [showToast, t]);

  const onRequestCode = useCallback(async () => {
    if (!complete || sending) return;
    setSending(true);
    try {
      await requestCode(digits);
      router.push({ pathname: '/(auth)/otp', params: { phone: digits } });
    } catch (error) {
      if (errorCode(error) === 'too_many_requests') {
        router.push({ pathname: '/(auth)/otp', params: { phone: digits } });
      } else {
        showToast({ message: t(authErrorKey(error)), tone: 'error' });
      }
    } finally {
      setSending(false);
    }
  }, [complete, digits, sending, showToast, t]);

  return (
    <Screen paddingHorizontal={24}>
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <HeroSurface style={[styles.logo, elevation.hero]}>
            <Text variant="titleLogo" color={colors.onHero}>
              C
            </Text>
          </HeroSurface>

          <View style={styles.intro}>
            <Text variant="titleXl">{t('auth.welcome')}</Text>
            <Text variant="labelRelaxed" color={colors.textSecondary}>
              {t('auth.phoneIntro')}
            </Text>
          </View>

          <PhoneField value={digits} onChange={setDigits} />

          <Button
            label={t('auth.requestCode')}
            disabled={!complete}
            loading={sending}
            onPress={onRequestCode}
            trailingIcon={
              <ArrowRight size={18} color={complete ? colors.onAction : colors.disabledText} strokeWidth={1.75} />
            }
          />

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text variant="caption" color={colors.textTertiary}>
              {t('auth.or')}
            </Text>
            <View style={styles.line} />
          </View>

          <View style={styles.social}>
            <SocialButton label={t('auth.google')} icon={<GoogleIcon />} onPress={soon} />
            <SocialButton
              label={t('auth.apple')}
              icon={<AppleIcon color={colors.surface} />}
              tone="dark"
              onPress={soon}
            />
          </View>
        </ScrollView>

        <View style={[styles.legal, { paddingBottom: insets.bottom + 12 }]}>
          <Text variant="captionRelaxed" color={colors.textTertiary}>
            {t('auth.legalPrefix')}{' '}
            <Text variant="captionRelaxed" color={colors.textStrong}>
              {t('auth.terms')}
            </Text>{' '}
            {t('auth.and')}{' '}
            <Text variant="captionRelaxed" color={colors.textStrong}>
              {t('auth.privacy')}
            </Text>
            {t('auth.legalSuffix')}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  flex: {
    flex: 1,
  },
  scroll: {
    paddingTop: 48,
    gap: 32,
    paddingBottom: 24,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intro: {
    gap: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  social: {
    gap: 10,
  },
  legal: {
    paddingTop: 12,
  },
}));
