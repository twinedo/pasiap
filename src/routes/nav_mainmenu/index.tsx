import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {History, Home, Information, SettingsPage} from 'pages';
import globalStyles from 'styles/globalStyles';
import {BLACK, GREY1, GREY2, PRIMARY, WHITE} from 'styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Spacer} from 'components';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function MyTabBar({state, descriptors, navigation}: any) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  // const changeStatusBar = settingStore(st => st.changeStatusBar);

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }
  return (
    <View style={[globalStyles.row, styles.barStyle]}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          //   changeStatusBar(index === 0 ? PRIMARY : WHITE);

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key + Math.random().toString()}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              globalStyles.displayFlex,
              globalStyles.alignCenter,
              globalStyles.row,
              globalStyles.justifyCenter,

              //   globalStyles.justifyEnd,
              {
                backgroundColor: isFocused ? WHITE : PRIMARY,
                marginVertical: 4,
                marginHorizontal: 6,
                borderRadius: 20,
                paddingHorizontal: 4,
              },
            ]}>
            {isFocused ? (
              <>
                <Ionicons
                  name={
                    index === 0
                      ? 'home'
                      : index === 1
                      ? 'list'
                      : index === 2
                      ? 'newspaper-outline'
                      : 'settings-sharp'
                  }
                  color={PRIMARY}
                  size={24}
                />
                <Spacer width={5} />
                <Text
                  style={[
                    globalStyles.bodyBold.h3,
                    {color: isFocused ? BLACK : GREY2},
                  ]}>
                  {label}
                </Text>
              </>
            ) : (
              <Ionicons
                name={
                  index === 0
                    ? 'home'
                    : index === 1
                    ? 'list'
                    : index === 2
                    ? 'newspaper-outline'
                    : 'settings-sharp'
                }
                color={GREY1}
                size={24}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const NavMainMenu = () => {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      initialRouteName="Home"
      tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Riwayat" component={History} />
      <Tab.Screen name="Informasi" component={Information} />

      <Tab.Screen name="Settings" component={SettingsPage} />
    </Tab.Navigator>
  );
};

export default NavMainMenu;

const styles = StyleSheet.create({
  barStyle: {
    backgroundColor: PRIMARY,
    height: 50,
    margin: 10,
    elevation: 10,
    // borderTopWidth: 0.2,
    // borderTopColor: '#e5e5e5',
    // paddingVertical: 8,
    borderRadius: 20,
  },
});
