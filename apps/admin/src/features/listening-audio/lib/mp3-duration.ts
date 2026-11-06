import { AppError } from '@/shared/api/app-error';

export const mp3Duration = (file: Blob) =>
  new Promise<number>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    const finish = () => URL.revokeObjectURL(url);
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => {
      finish();
      resolve(Math.ceil(audio.duration));
    };
    audio.onerror = () => {
      finish();
      reject(new AppError('audioUnreadable'));
    };
    audio.src = url;
  });
