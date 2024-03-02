/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import 'react-native-gesture-handler';
const isHermes = () => !!global.HermesInternal;
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  const channelId = await notifee.createChannel({
    id: 'default background',
    name: 'Background Channel',
    importance: AndroidImportance.HIGH,
  });
  // Display a notification
  await notifee.displayNotification({
    title: remoteMessage?.data?.message,
    body: remoteMessage?.data?.subHeader,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
    },
  });
});
AppRegistry.registerComponent(appName, () => App);
