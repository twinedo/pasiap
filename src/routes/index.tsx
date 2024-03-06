import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  ChangePassword,
  ForgotPassword,
  InformationForm,
  InformationView,
  Login,
  Profile,
  Register,
  SOSFire,
  SOSGeneral,
  SOSPublic,
} from 'pages';
import NavMainMenu from './nav_mainmenu';
import authStore from 'store/authStore';
import {LoadingLogo} from 'components';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import reportStore from 'store/reportStore';
import {onMessageReceived} from 'utils/fun';
const Stack = createStackNavigator();

const Routes = () => {
  const {Navigator, Screen} = Stack;
  const {isLoggedIn, _onCheckExpired, isLoading, loginData} = authStore();
  const {_getAllReports} = reportStore();

  useEffect(() => {
    if (isLoggedIn) {
      _onCheckExpired();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage', remoteMessage);
      const channelId = await notifee.createChannel({
        id: 'default foreground',
        name: 'Background Channel',
        importance: AndroidImportance.HIGH,
      });
      if (loginData?.role === remoteMessage?.data?.role_name) {
        // Display a notification
        await notifee.displayNotification({
          title: remoteMessage?.notification?.title,
          body: remoteMessage?.notification?.body,
          android: {
            channelId,
            importance: AndroidImportance.HIGH,
          },
        });
      }
      _getAllReports();
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
          <Screen name="InformationForm" component={InformationForm} />
          <Screen name="InformationView" component={InformationView} />
          <Screen name="Profile" component={Profile} />
          <Screen name="ChangePassword" component={ChangePassword} />
          <Screen name="SOSFire" component={SOSFire} />
          <Screen name="SOSGeneral" component={SOSGeneral} />
          <Screen name="SOSPublic" component={SOSPublic} />
        </>
      ) : (
        <>
          <Screen name="Login" component={Login} />
          <Screen name="Register" component={Register} />
          <Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      )}
    </Navigator>
  );
};

export default Routes;
