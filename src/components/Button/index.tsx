import {
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  PressableProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import React, {ReactNode} from 'react';
import PropTypes from 'prop-types';
import {BLACK, WHITE} from 'styles/colors';

type IButtonProps = {
  text?: string | ReactNode | boolean;
  prefix?: ReactNode;
  postfix?: ReactNode;
  containerStyle?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  textColor?: string;
  textStyle?: TextStyle | TextStyle[];
} & TouchableOpacityProps;

const Button = (props: IButtonProps & PressableProps) => {
  const {text, textStyle, prefix, postfix, containerStyle, onPress, textColor} =
    props;
  return (
    <TouchableOpacity
      {...props}
      style={[styles.container, containerStyle]}
      onPress={onPress}>
      {prefix}
      <Text style={[styles.text, textStyle, {color: textColor}]}>{text}</Text>
      {postfix}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: BLACK,
    fontSize: 18,
  },
});

Button.propTypes = {
  text: PropTypes.any,
  prefix: PropTypes.element,
  postfix: PropTypes.element,
  onPress: PropTypes.func,
  containerStyle: PropTypes.any,
  textColor: PropTypes.string,
};
