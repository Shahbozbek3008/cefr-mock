import { loadFcm } from './model/messaging';

const fcm = loadFcm();

if (fcm) fcm.api.setBackgroundMessageHandler(fcm.client, async () => undefined);
