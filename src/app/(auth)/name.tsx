import { useCallback, useState } from 'react';
import { TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { updateProfile, useUserStore } from '@/entities/user/model';
import { authErrorKey } from '@/features/auth/model';
import { useI18n } from '@/shared/i18n';
import { makeStyles, radius, size, space, type, useTheme } from '@/shared/theme';
import { Button, Screen, Text, useToast } from '@/shared/ui';

const MIN_LENGTH = 2;
const MAX_LENGTH = 60;

export default function NameScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const showToast = useToast((s) => s.show);
  const valid = name.trim().length >= MIN_LENGTH;

  const save = useCallback(async () => {
    if (!valid || saving) return;
    setSaving(true);
    try {
      const value = name.trim();
      await updateProfile({ name: value });
      const { user, setUser } = useUserStore.getState();
      if (user) setUser({ ...user, name: value });
      router.replace('/(tabs)/home');
    } catch (error) {
      setSaving(false);
      showToast({ message: t(authErrorKey(error)), tone: 'error' });
    }
  }, [name, saving, showToast, t, valid]);

  return (
    <Screen paddingHorizontal={24}>
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <View style={styles.content}>
          <View style={styles.intro}>
            <Text variant="titleXl">{t('auth.nameTitle')}</Text>
            <Text variant="labelRelaxed" color={colors.textSecondary}>
              {t('auth.nameSubtitle')}
            </Text>
          </View>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('auth.namePlaceholder')}
            placeholderTextColor={colors.textTertiary}
            selectionColor={colors.selectedBorder}
            maxLength={MAX_LENGTH}
            autoFocus
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
            returnKeyType="done"
            onSubmitEditing={save}
            style={styles.input}
          />
        </View>

        <Button
          label={t('common.continue')}
          disabled={!valid}
          loading={saving}
          onPress={save}
          trailingIcon={
            <ArrowRight size={18} color={valid ? colors.onAction : colors.disabledText} strokeWidth={1.75} />
          }
          style={styles.cta}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: space[8],
    paddingTop: space[12],
  },
  intro: {
    gap: space[2.5],
  },
  input: {
    ...type.body,
    height: size.fieldL,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: space[4],
    color: colors.text,
  },
  cta: {
    marginBottom: space[4],
  },
}));
