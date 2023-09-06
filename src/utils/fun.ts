import notifee, {AndroidImportance} from '@notifee/react-native';
import {RemoteMessageProps} from './interfaces';

export async function onMessageReceived(message: RemoteMessageProps) {
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
  // Display a notification
  await notifee.displayNotification({
    title: message?.notification!.title,
    body: message?.notification!.body,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
    },
  });
}
