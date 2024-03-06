import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from 'routes';
import codePush from 'react-native-code-push';

let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_RESUME};

const App = () => {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
};

export default codePush(codePushOptions)(App);
