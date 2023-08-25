import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Login, Profile, Register, SOSFire, SOSGeneral, SOSPublic} from 'pages';
import NavMainMenu from './nav_mainmenu';
import authStore from 'store/authStore';
import {LoadingLogo} from 'components';
const Stack = createStackNavigator();

const Routes = () => {
  const {Navigator, Screen} = Stack;
  const {isLoggedIn, _onCheckExpired, isLoading} = authStore();

  useEffect(() => {
    if (isLoggedIn) {
      _onCheckExpired();
    }
  }, [isLoggedIn]);

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
