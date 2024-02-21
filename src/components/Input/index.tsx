import React, {ReactNode} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextStyle,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import {BLACK, GREY8} from 'styles/colors';
import globalStyles from 'styles/globalStyles';

export interface IInputProps extends TextInputProps {
  prefix?: ReactNode;
  postfix?: ReactNode;
  style?: TextStyle | TextStyle[];
  containerStyle?: ViewStyle | ViewStyle[];
  prefixStyle?: ViewStyle | ViewStyle[];
  postfixStyle?: ViewStyle | ViewStyle[];
  // You can add more TextInput props here
}

const Input: React.FC<IInputProps> = ({
  prefix,
  postfix,
  style,
  containerStyle,
  prefixStyle,
  postfixStyle,
  ...textInputProps
}) => {
  return (
    <View
      style={[
        globalStyles.row,
        globalStyles.alignCenter,
        styles.container,
        containerStyle,
      ]}>
      {prefix && <View style={[styles.prefix, prefixStyle]}>{prefix}</View>}
      <TextInput
        {...textInputProps}
        style={[globalStyles.displayFlex, styles.input, style]}
      />
      {postfix && <View style={[styles.postfix, postfixStyle]}>{postfix}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: GREY8,
    borderRadius: 5,
    position: 'relative',
  },
  prefix: {
    padding: 8,
  },
  input: {
    padding: 8,
    color: BLACK,
  },
  postfix: {
    padding: 8,
  },
});

export default Input;
