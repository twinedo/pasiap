import {StyleSheet, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import globalStyles from 'styles/globalStyles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {GREY3, PRIMARY} from 'styles/colors';

type TCounter = {
  onChangeValue: (val: number) => void;
  defaultValue: number;
};

export const Counter = React.memo((props: TCounter) => {
  const {onChangeValue, defaultValue = 0} = props;
  const [count, setCount] = useState(defaultValue);

  const _onMinusPress = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      onChangeValue(newCount);
    }
  };

  const _onPlusPress = () => {
    const newCount = count + 1;
    setCount(newCount);
    onChangeValue(newCount);
  };

  const _onChangeText = (text: string) => {
    const numericValue = parseInt(text, 10);

    if (text === '') {
      setCount(0);
      onChangeValue(0);
    } else if (!isNaN(numericValue)) {
      setCount(numericValue);
      onChangeValue(numericValue);
    }
  };

  return (
    <View
      style={[
        globalStyles.row,
        globalStyles.justifyEven,
        globalStyles.alignCenter,
      ]}>
      <AntDesign
        name="minuscircleo"
        size={24}
        color={count === 0 ? GREY3 : PRIMARY}
        onPress={_onMinusPress}
      />

      <TextInput
        placeholder={'0'}
        placeholderTextColor={GREY3}
        value={count.toString()}
        style={[globalStyles.headingBold.h3, styles.input]}
        onChangeText={_onChangeText}
        keyboardType="numeric"
      />
      <AntDesign
        name="pluscircleo"
        size={24}
        color={PRIMARY}
        onPress={_onPlusPress}
      />
    </View>
  );
});

export default Counter;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#959595',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
    textAlign: 'center',
  },
});
