import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { isPhoneComplete } from '@/features/auth/model';
import { PhoneField } from '@/features/auth/ui/PhoneField';
import { SocialButton } from '@/features/auth/ui/SocialButton';
import { AppleIcon, GoogleIcon } from '@/shared/icons';
import { elevation, light, radius } from '@/shared/theme';
import { Button, HeroSurface, Screen, Text } from '@/shared/ui';

export default function PhoneScreen() {
  const insets = useSafeAreaInsets();
  const [digits, setDigits] = useState('');

  const complete = isPhoneComplete(digits);

  const onRequestCode = useCallback(() => {
    if (!complete) return;
    router.push({ pathname: '/(auth)/otp', params: { phone: digits } });
  }, [complete, digits]);

  return (
    <Screen paddingHorizontal={24}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <HeroSurface style={[styles.logo, elevation.hero]}>
            <Text variant="titleLogo" color={light.onHero}>
              C
            </Text>
          </HeroSurface>

          <View style={styles.intro}>
            <Text variant="titleXl">Xush kelibsiz</Text>
            <Text variant="labelRelaxed" color={light.textSecondary}>
              Telefon raqamingizni kiriting — SMS orqali tasdiqlash kodi yuboramiz.
            </Text>
          </View>

          <PhoneField value={digits} onChange={setDigits} />

          <Button
            label="SMS kod olish"
            disabled={!complete}
            onPress={onRequestCode}
            trailingIcon={
              <ArrowRight
                size={18}
                color={complete ? light.onAction : light.disabledText}
                strokeWidth={1.75}
              />
            }
          />

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text variant="caption" color={light.textTertiary}>
              yoki
            </Text>
            <View style={styles.line} />
          </View>

          <View style={styles.social}>
            <SocialButton
              label="Google bilan davom etish"
              icon={<GoogleIcon />}
              onPress={() => undefined}
            />
            <SocialButton
              label="Apple bilan davom etish"
              icon={<AppleIcon />}
              tone="dark"
              onPress={() => undefined}
            />
          </View>
        </ScrollView>

        <View style={[styles.legal, { paddingBottom: insets.bottom + 12 }]}>
          <Text variant="captionRelaxed" color={light.textTertiary}>
            Davom etish orqali{' '}
            <Text variant="captionRelaxed" color={light.textStrong}>
              Foydalanish shartlari
            </Text>{' '}
            va{' '}
            <Text variant="captionRelaxed" color={light.textStrong}>
              Maxfiylik siyosati
            </Text>
            ga rozilik bildirasiz.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: light.border,
  },
  social: {
    gap: 10,
  },
  legal: {
    paddingTop: 12,
  },
});
