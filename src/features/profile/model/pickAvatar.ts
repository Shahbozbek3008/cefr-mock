import { requireOptionalNativeModule } from 'expo';
import type { ImagePickerOptions } from 'expo-image-picker';

type PickerApi = typeof import('expo-image-picker');
type ManipulatorApi = typeof import('expo-image-manipulator');

export type AvatarSource = 'library' | 'camera';

export class AvatarPickError extends Error {
  constructor(readonly reason: 'unavailable' | 'denied') {
    super(reason);
    this.name = 'AvatarPickError';
  }
}

const AVATAR_SIZE = 512;
const JPEG_QUALITY = 0.82;

const pickerOptions: ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 1,
};

const isAvailable = () =>
  Boolean(requireOptionalNativeModule('ExponentImagePicker') && requireOptionalNativeModule('ExpoImageManipulator'));

const resize = async (uri: string) => {
  const { ImageManipulator, SaveFormat } = require('expo-image-manipulator') as ManipulatorApi;
  const image = await ImageManipulator.manipulate(uri).resize({ width: AVATAR_SIZE }).renderAsync();
  const saved = await image.saveAsync({ compress: JPEG_QUALITY, format: SaveFormat.JPEG });
  return saved.uri;
};

export const pickAvatar = async (source: AvatarSource): Promise<string | null> => {
  if (!isAvailable()) throw new AvatarPickError('unavailable');
  const picker = require('expo-image-picker') as PickerApi;

  const permission =
    source === 'camera'
      ? await picker.requestCameraPermissionsAsync()
      : await picker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) throw new AvatarPickError('denied');

  const result =
    source === 'camera'
      ? await picker.launchCameraAsync(pickerOptions)
      : await picker.launchImageLibraryAsync(pickerOptions);
  const asset = result.canceled ? undefined : result.assets[0];
  return asset ? resize(asset.uri) : null;
};
