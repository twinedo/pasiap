import {StyleSheet, Text, View} from 'react-native';
import React, {ReactNode, useState} from 'react';
import SelectDropdown, {
  SelectDropdownProps,
} from 'react-native-select-dropdown';
import {BLACK, GREY1, GREY2, GREY3, WHITE} from 'styles/colors';
import globalStyles from 'styles/globalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ISelectPrimary = {
  title?: string;
  data: any[];
  onSelect: (selectedItem: any, index: number) => void;
  buttonTextAfterSelection?: (selectedItem: any, index: number) => void;
  rowTextForSelection?: (item: any, index: number) => void;
  renderCustomizedRowChild?: (
    selectedItem: any,
    index: number,
    isSelected?: boolean,
  ) => ReactNode;
  keyItem: string;
  defaultButtonText: string;
} & SelectDropdownProps;

const SelectPrimary = (props: ISelectPrimary) => {
  const {title, data, onSelect, keyItem, renderCustomizedRowChild} = props;
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [colorSelection, setColorSelection] = useState(GREY2);

  const styles = createStyles(colorSelection);

  return (
    <View>
      {title && <Text style={[globalStyles.headingRegular.h3]}>{title}</Text>}
      <SelectDropdown
        {...props}
        data={data}
        onSelect={onSelect}
        onFocus={() => setIsShowDropdown(true)}
        onBlur={() => setIsShowDropdown(false)}
        buttonStyle={styles.buttonStyle}
        buttonTextStyle={styles.buttonTextStyle}
        rowStyle={{backgroundColor: WHITE, padding: 10}}
        dropdownIconPosition="left"
        // renderDropdownIcon={() => (
        //   <Ionicons name="people-outline" size={24} color={GREY2} />
        // )}
        defaultButtonText={props.defaultButtonText}
        dropdownStyle={styles.dropdownStyle}
        rowTextStyle={styles.rowTextStyle}
        renderCustomizedRowChild={renderCustomizedRowChild}
        buttonTextAfterSelection={selectedItem => {
          setColorSelection(BLACK);
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          return selectedItem[`${keyItem}`];
        }}
        rowTextForSelection={item => {
          return item[`${keyItem}`];
        }}
      />
    </View>
  );
};

export default SelectPrimary;

const createStyles = (colorSelection: string) =>
  StyleSheet.create({
    buttonStyle: {
      backgroundColor: GREY1,
      borderRadius: 4,
      height: 40,
      width: '100%',
      paddingLeft: 16,
    },
    buttonTextStyle: {
      textAlign: 'left',
      fontSize: 14,
      paddingLeft: 6,
      color: colorSelection,
    },
    dropdownStyle: {
      backgroundColor: WHITE,
      borderRadius: 8,
      // paddingHorizontal: 10,
    },
    rowTextStyle: {
      textAlign: 'left',
    },
    mr10: {marginRight: 10},
  });
