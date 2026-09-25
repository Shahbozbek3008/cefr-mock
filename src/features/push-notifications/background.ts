import { setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import { messaging } from './model/messaging';

const client = messaging();

if (client) setBackgroundMessageHandler(client, async () => undefined);
