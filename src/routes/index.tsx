import {StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Login, Profile, Register, SOSFire, SOSGeneral, SOSPublic} from 'pages';
import NavMainMenu from './nav_mainmenu';
import authStore from 'store/authStore';
import {LoadingLogo} from 'components';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
const Stack = createStackNavigator();

const Routes = () => {
  const {Navigator, Screen} = Stack;
  const {isLoggedIn, _onCheckExpired, isLoading} = authStore();

  useEffect(() => {
    if (isLoggedIn) {
      _onCheckExpired();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage', remoteMessage);
      // onMessageReceived(remoteMessage);
      const channelId = await notifee.createChannel({
        id: 'default foreground',
        name: 'Background Channel',
        importance: AndroidImportance.HIGH,
      });
      // Display a notification
      await notifee.displayNotification({
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
        },
      });
    });

    return () => {
      unsubscribe;
    };
  }, []);

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });
  }, []);

  if (isLoading) {
    return <LoadingLogo />;
  }

  return (
    <Navigator screenOptions={{headerShown: false}}>
      {isLoggedIn ? (
        <>
          <Screen name="NavMainMenu" component={NavMainMenu} />
          <Screen name="Profile" component={Profile} />
          <Screen name="SOSFire" component={SOSFire} />
          <Screen name="SOSGeneral" component={SOSGeneral} />
          <Screen name="SOSPublic" component={SOSPublic} />
        </>
      ) : (
        <>
          <Screen name="Login" component={Login} />
          <Screen name="Register" component={Register} />
        </>
      )}
    </Navigator>
  );
};

export default Routes;

const styles = StyleSheet.create({});
