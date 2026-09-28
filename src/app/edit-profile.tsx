import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { router, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Lock } from 'lucide-react-native';
import { PHONE_PREFIX, formatPhone } from '@/features/auth/model';
import { AvatarPickError, pickAvatar } from '@/features/profile/model/pickAvatar';
import type { AvatarSource } from '@/features/profile/model/pickAvatar';
import { useProfileEditor } from '@/features/profile/model/useProfileEditor';
import { AvatarEditor } from '@/features/profile/ui/AvatarEditor';
import { PhotoSheet } from '@/features/profile/ui/PhotoSheet';
import { useI18n } from '@/shared/i18n';
import { size, space, useTheme } from '@/shared/theme';
import { Button, Card, ConfirmSheet, IconButton, Screen, Text, TextField, TopBar, useToast } from '@/shared/ui';

const FOOTER_SPACE = size.buttonL + space[6];

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const showToast = useToast((s) => s.show);
  const editor = useProfileEditor();
  const [photoOpen, setPhotoOpen] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const pendingSource = useRef<AvatarSource | null>(null);
  const leaving = useRef(false);
  const dirtyRef = useRef(editor.dirty);
  const lastNameRef = useRef<TextInput>(null);
  dirtyRef.current = editor.dirty;

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (event) => {
        if (!dirtyRef.current || leaving.current) return;
        event.preventDefault();
        setDiscardOpen(true);
      }),
    [navigation],
  );

  const leave = useCallback(() => {
    leaving.current = true;
    router.back();
  }, []);

  const onPick = useCallback((source: AvatarSource) => {
    pendingSource.current = source;
    setPhotoOpen(false);
  }, []);

  const onPhotoSheetHidden = useCallback(async () => {
    const source = pendingSource.current;
    pendingSource.current = null;
    if (!source) return;
    try {
      const uri = await pickAvatar(source);
      if (uri) editor.pickPhoto(uri);
    } catch (error) {
      const reason = error instanceof AvatarPickError ? error.reason : 'unavailable';
      const key = reason === 'denied' ? 'profileEdit.permissionDenied' : 'profileEdit.pickerUnavailable';
      showToast({ message: t(key), tone: 'error' });
    }
  }, [editor, showToast, t]);

  const onRemovePhoto = useCallback(() => {
    editor.removePhoto();
    setPhotoOpen(false);
  }, [editor]);

  const onSave = useCallback(async () => {
    setTouched(true);
    if (!editor.valid) return;
    try {
      await editor.save();
      showToast({ message: t('profileEdit.saved'), tone: 'success' });
      leave();
    } catch {
      showToast({ message: t('profileEdit.saveFailed'), tone: 'error' });
    }
  }, [editor, leave, showToast, t]);

  const firstNameError = touched && !editor.valid ? t('profileEdit.firstNameRequired') : undefined;
  const phone = editor.phone ? `${PHONE_PREFIX} ${formatPhone(editor.phone.replace(PHONE_PREFIX, ''))}` : '';

  return (
    <Screen>
      <TopBar
        centered
        left={
          <IconButton accessibilityLabel={t('common.back')} onPress={router.back}>
            <ChevronLeft size={17} color={colors.textStrong} strokeWidth={1.6} />
          </IconButton>
        }
        center={<Text variant="bodySmMedium">{t('profileEdit.title')}</Text>}
        right={null}
      />

      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: FOOTER_SPACE }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AvatarEditor name={editor.displayName} uri={editor.avatarUri} onPress={() => setPhotoOpen(true)} />

          <View style={styles.section}>
            <Text variant="caption" color={colors.textTertiary} style={styles.sectionLabel}>
              {t('profileEdit.personal')}
            </Text>
            <Card style={styles.card}>
              <TextField
                label={t('profileEdit.firstName')}
                value={editor.firstName}
                onChangeText={editor.setFirstName}
                onBlur={() => setTouched(true)}
                placeholder={t('profileEdit.firstNamePlaceholder')}
                error={firstNameError}
                maxLength={40}
                autoCapitalize="words"
                autoComplete="given-name"
                textContentType="givenName"
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
              />
              <TextField
                inputRef={lastNameRef}
                label={t('profileEdit.lastName')}
                value={editor.lastName}
                onChangeText={editor.setLastName}
                placeholder={t('profileEdit.lastNamePlaceholder')}
                maxLength={40}
                autoCapitalize="words"
                autoComplete="family-name"
                textContentType="familyName"
                returnKeyType="done"
                onSubmitEditing={onSave}
              />
            </Card>
          </View>

          {phone ? (
            <Card style={styles.card}>
              <TextField
                label={t('profileEdit.phone')}
                value={phone}
                readOnly
                hint={t('profileEdit.phoneLocked')}
                trailing={<Lock size={16} color={colors.textTertiary} strokeWidth={1.7} />}
              />
            </Card>
          ) : null}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space[3]) }]}>
          <Button
            label={t('profileEdit.save')}
            align="center"
            disabled={!editor.dirty}
            loading={editor.saving}
            onPress={onSave}
          />
        </View>
      </KeyboardAvoidingView>

      <PhotoSheet
        visible={photoOpen}
        hasPhoto={editor.avatarUri !== null}
        onPick={onPick}
        onRemove={onRemovePhoto}
        onClose={() => setPhotoOpen(false)}
        onHidden={onPhotoSheetHidden}
      />

      <ConfirmSheet
        visible={discardOpen}
        title={t('profileEdit.discardTitle')}
        message={t('profileEdit.discardMessage')}
        confirmLabel={t('profileEdit.discard')}
        cancelLabel={t('profileEdit.keepEditing')}
        tone="destructive"
        onConfirm={() => {
          setDiscardOpen(false);
          leave();
        }}
        onClose={() => setDiscardOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingTop: space[5],
    gap: space[5],
  },
  section: {
    gap: space[2],
  },
  sectionLabel: {
    paddingHorizontal: space[1],
  },
  card: {
    padding: space[4],
    gap: space[4],
  },
  footer: {
    paddingTop: space[3],
  },
});
