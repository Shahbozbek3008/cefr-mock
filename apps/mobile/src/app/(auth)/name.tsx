import { useCallback, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { fetchProfile, updateProfile, useUserStore } from '@/entities/user/model';
import { authErrorKey } from '@/features/auth/model';
import { useI18n } from '@/shared/i18n';
import { makeStyles, space, useTheme } from '@/shared/theme';
import { Button, Screen, Text, TextField, useToast } from '@/shared/ui';

const MIN_LENGTH = 2;
const MAX_LENGTH = 40;

export default function NameScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);
  const lastNameRef = useRef<TextInput>(null);
  const showToast = useToast((s) => s.show);
  const valid = firstName.trim().length >= MIN_LENGTH;

  const save = useCallback(async () => {
    if (!valid || saving) return;
    setSaving(true);
    try {
      await updateProfile({ firstName, lastName });
      useUserStore.getState().applyProfile(await fetchProfile());
      router.replace('/(tabs)/home');
    } catch (error) {
      setSaving(false);
      showToast({ message: t(authErrorKey(error)), tone: 'error' });
    }
  }, [firstName, lastName, saving, showToast, t, valid]);

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

          <View style={styles.fields}>
            <TextField
              label={t('profileEdit.firstName')}
              value={firstName}
              onChangeText={setFirstName}
              placeholder={t('profileEdit.firstNamePlaceholder')}
              maxLength={MAX_LENGTH}
              autoFocus
              autoCapitalize="words"
              autoComplete="given-name"
              textContentType="givenName"
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />
            <TextField
              inputRef={lastNameRef}
              label={t('profileEdit.lastName')}
              value={lastName}
              onChangeText={setLastName}
              placeholder={t('profileEdit.lastNamePlaceholder')}
              maxLength={MAX_LENGTH}
              autoCapitalize="words"
              autoComplete="family-name"
              textContentType="familyName"
              returnKeyType="done"
              onSubmitEditing={save}
            />
          </View>
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

const useStyles = makeStyles(() => ({
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
  fields: {
    gap: space[4],
  },
  cta: {
    marginBottom: space[4],
  },
}));
