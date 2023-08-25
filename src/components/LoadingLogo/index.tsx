import {View, Dimensions, ActivityIndicator, Image} from 'react-native';
import React from 'react';
import globalStyles from 'styles/globalStyles';
// import Logo from 'assets/images/logo.png';
import {PRIMARY, WHITE} from 'styles/colors';

const {width} = Dimensions.get('window');

const LoadingLogo = () => {
  return (
    <View
      style={[
        globalStyles.displayFlex,
        globalStyles.justifyCenter,
        globalStyles.alignCenter,
        {backgroundColor: WHITE},
      ]}>
      <Image
        source={require('assets/images/logo.png')}
        style={{width: width / 3, height: width / 3, resizeMode: 'contain'}}
      />
      {/* <Logo width={width / 3} height={width / 3} /> */}
      <ActivityIndicator size="large" color={PRIMARY} />
    </View>
  );
};

export default LoadingLogo;
