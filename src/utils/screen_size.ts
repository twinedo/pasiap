import {Dimensions} from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const height = screenHeight < screenWidth ? screenWidth : screenHeight;
const width = screenWidth < screenHeight ? screenWidth : screenHeight;

function percentageWidth(percent: number): number {
  return width * (percent / 100);
}

function percentageHeight(percent: number): number {
  return height * (percent / 100);
}

export {percentageHeight, percentageWidth};
