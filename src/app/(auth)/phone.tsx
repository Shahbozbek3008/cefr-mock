import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { useUserStore } from '@/entities/user/model';
import type { User } from '@/entities/user/model';
import { isPhoneComplete, useGoogleSignIn } from '@/features/auth/model';
import { PhoneField } from '@/features/auth/ui/PhoneField';
import { SocialButton } from '@/features/auth/ui/SocialButton';
import { AppleIcon, GoogleIcon } from '@/shared/icons';
import { makeStyles, radius, useTheme } from '@/shared/theme';
import { Button, HeroSurface, Screen, Text, useToast } from '@/shared/ui';

export default function PhoneScreen() {
  const styles = useStyles();
  const { colors, elevation } = useTheme();
  const insets = useSafeAreaInsets();
  const [digits, setDigits] = useState('');

  const complete = isPhoneComplete(digits);
  const setUser = useUserStore((s) => s.setUser);
  const showToast = useToast((s) => s.show);

  const onGoogleUser = useCallback(
    (user: User) => {
      setUser(user);
      router.replace('/(tabs)/home');
    },
    [setUser],
  );

  const onGoogleError = useCallback((message: string) => showToast({ message, tone: 'error' }), [showToast]);

  const google = useGoogleSignIn(onGoogleUser, onGoogleError);

  const onRequestCode = useCallback(() => {
    if (!complete) return;
    router.push({ pathname: '/(auth)/otp', params: { phone: digits } });
  }, [complete, digits]);

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
            <Text variant="titleXl">Xush kelibsiz</Text>
            <Text variant="labelRelaxed" color={colors.textSecondary}>
              Telefon raqamingizni kiriting — SMS orqali tasdiqlash kodi yuboramiz.
            </Text>
          </View>

          <PhoneField value={digits} onChange={setDigits} />

          <Button
            label="SMS kod olish"
            disabled={!complete}
            onPress={onRequestCode}
            trailingIcon={
              <ArrowRight size={18} color={complete ? colors.onAction : colors.disabledText} strokeWidth={1.75} />
            }
          />

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text variant="caption" color={colors.textTertiary}>
              yoki
            </Text>
            <View style={styles.line} />
          </View>

          <View style={styles.social}>
            <SocialButton
              label="Google bilan davom etish"
              icon={<GoogleIcon />}
              loading={google.loading}
              onPress={google.signIn}
            />
            <SocialButton
              label="Apple bilan davom etish"
              icon={<AppleIcon color={colors.surface} />}
              tone="dark"
              onPress={() => undefined}
            />
          </View>
        </ScrollView>

        <View style={[styles.legal, { paddingBottom: insets.bottom + 12 }]}>
          <Text variant="captionRelaxed" color={colors.textTertiary}>
            Davom etish orqali{' '}
            <Text variant="captionRelaxed" color={colors.textStrong}>
              Foydalanish shartlari
            </Text>{' '}
            va{' '}
            <Text variant="captionRelaxed" color={colors.textStrong}>
              Maxfiylik siyosati
            </Text>
            ga rozilik bildirasiz.
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
