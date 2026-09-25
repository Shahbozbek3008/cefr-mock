import { useCallback, useState } from 'react';
import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import type { User } from '@/entities/user/model';
import { googleConfig } from '@/shared/config/google';

const DEVELOPER_ERROR = '10';

const messages = {
  generic: "Google orqali kirib bo'lmadi. Qayta urinib ko'ring.",
  notConfigured: 'Google kirish hali sozlanmagan. Client ID va SHA-1 ni tekshiring.',
  playServices: 'Qurilmada Google Play xizmatlari mavjud emas yoki eskirgan.',
  inProgress: 'Kirish jarayoni allaqachon boshlangan.',
};

let configured = false;

const ensureConfigured = () => {
  if (configured) return;
  GoogleSignin.configure({
    webClientId: googleConfig.webClientId,
    iosClientId: googleConfig.iosClientId,
    scopes: ['profile', 'email'],
  });
  configured = true;
};

export type GoogleSignInResult =
  { status: 'success'; user: User } | { status: 'cancelled' } | { status: 'error'; message: string };

const errorMessage = (error: unknown) => {
  if (!isErrorWithCode(error)) return messages.generic;
  if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) return messages.playServices;
  if (error.code === statusCodes.IN_PROGRESS) return messages.inProgress;
  if (error.code === DEVELOPER_ERROR) return messages.notConfigured;
  return messages.generic;
};

export const signInWithGoogle = async (): Promise<GoogleSignInResult> => {
  if (!googleConfig.webClientId) {
    return { status: 'error', message: messages.notConfigured };
  }

  try {
    ensureConfigured();
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    if (isCancelledResponse(response) || !isSuccessResponse(response)) return { status: 'cancelled' };

    const { user } = response.data;
    return {
      status: 'success',
      user: {
        id: user.id,
        name: user.name ?? user.givenName ?? user.email,
        email: user.email,
        provider: 'google',
        isPro: false,
      },
    };
  } catch (error) {
    if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) return { status: 'cancelled' };
    return { status: 'error', message: errorMessage(error) };
  }
};

export const signOutFromGoogle = async () => {
  ensureConfigured();
  await GoogleSignin.signOut().catch(() => null);
};

export const useGoogleSignIn = (onSuccess: (user: User) => void, onError: (message: string) => void) => {
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);
    if (result.status === 'success') onSuccess(result.user);
    if (result.status === 'error') onError(result.message);
  }, [loading, onError, onSuccess]);

  return { signIn, loading };
};
