import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import {WHITE} from 'styles/colors';
import globalStyles from 'styles/globalStyles';

type ToolbarProps = {
  text?: string;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle | ViewStyle[];
  prefix?: React.ReactNode;
  prefixStyle?: ViewStyle | ViewStyle[];
  postfix?: React.ReactNode;
  postfixStyle?: ViewStyle | ViewStyle[];
  middleStyle?: ViewStyle | ViewStyle[];
} & ViewProps;

const Toolbar = (props: ToolbarProps & ViewProps) => {
  const {
    text,
    textStyle,
    containerStyle,
    prefix,
    prefixStyle,
    postfix,
    postfixStyle,
    middleStyle,
  } = props;
  return (
    <View
      {...props}
      style={[
        globalStyles.row,
        globalStyles.alignCenter,
        globalStyles.justifySpaceBetween,
        styles.container,
        containerStyle,
      ]}>
      <View {...props} style={[styles.prefix, prefixStyle]}>
        {prefix}
      </View>
      {text !== undefined && (
        <View {...props} style={[styles.middle, middleStyle]}>
          <Text style={[globalStyles.headingBold.h3, textStyle]}>{text}</Text>
        </View>
      )}
      <View {...props} style={[styles.postfix, postfixStyle]}>
        {postfix}
      </View>
    </View>
  );
};

export default Toolbar;

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingHorizontal: 12,
    backgroundColor: WHITE,
  },
  middle: {
    flex: 2,
    alignItems: 'center',
  },
  prefix: {
    flex: 0.5,
    alignItems: 'flex-start',
  },
  postfix: {
    flex: 0.5,
    alignItems: 'flex-end',
  },
});

Toolbar.propTypes = {
  text: PropTypes.string,
  prefix: PropTypes.element,
  postfix: PropTypes.element,
};
