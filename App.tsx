import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from 'routes';
import globalStyles from 'styles/globalStyles';
import {WHITE} from 'styles/colors';

const App = () => {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
