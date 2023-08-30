import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
  Linking,
  StatusBar,
} from 'react-native';
import React, {useCallback} from 'react';
import {BaseContainer, Spacer} from 'components';
import globalStyles from 'styles/globalStyles';
import {percentageHeight} from 'utils/screen_size';
import {PRIMARY, WHITE, GREY2, GREY1} from 'styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import authStore from 'store/authStore';
import settingStore from 'store/settingStore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoutesParam} from 'routes/types';
import userStore from 'store/userStore';

const SettingsPage = () => {
  const navigation =
    useNavigation<StackNavigationProp<RoutesParam, 'Settings'>>();

  const menu = [
    {
      id: 1,
      name: 'Profile',
      isNavigate: true,
      navigate: '#',
      icon: <Ionicons name="person" size={24} color={GREY2} />,
    },
    {
      id: 2,
      name: 'FAQ',
      isNavigate: true,
      navigate: '#',
      icon: <FontAwesome6 name="list-check" size={24} color={GREY2} />,
    },
    {
      id: 3,
      name: 'Contact Person',
      isNavigate: true,
      navigate: '#',
      icon: <MaterialCommunityIcons name="contacts" size={24} color={GREY2} />,
    },
    {
      id: 4,
      name: 'E Damkar V.1.0',
      isNavigate: false,
      navigate: '',
      icon: <Octicons name="versions" size={24} color={GREY2} />,
    },
    {
      id: 5,
      name: 'Logout',
      isNavigate: true,
      navigate: '',
      icon: <MaterialIcons name="logout" size={24} color={GREY2} />,
    },
  ];

  const {_onLogout} = authStore();
  const {changeStatusBar, settings} = settingStore();
  const {userData} = userStore();

  useFocusEffect(
    useCallback(() => {
      changeStatusBar(PRIMARY);
    }, [settings.statusBarColor]),
  );

  return (
    <BaseContainer>
      <StatusBar
        backgroundColor={settings.statusBarColor}
        barStyle="light-content"
      />
      <View
        style={[
          globalStyles.justifyCenter,
          globalStyles.alignCenter,
          {
            height: percentageHeight(30),
            borderBottomLeftRadius: 70,
            borderBottomRightRadius: 70,
            overflow: 'hidden',
            backgroundColor: PRIMARY,
          },
        ]}>
        <Image
          source={
            userData?.photo === null ||
            userData?.photo === '' ||
            userData?.photo === undefined
              ? require('assets/images/logo.png')
              : {uri: userData?.photo}
          }
          style={{
            width: 70,
            height: 70,
            borderRadius: 70,
            borderWidth: 3,
            borderColor: WHITE,
          }}
        />
        <Spacer height={15} />
        <Text style={[globalStyles.headingBold.h3, {color: WHITE}]}>
          {userData?.full_name}
        </Text>
        <Text style={[globalStyles.headingBold.h3, {color: WHITE}]}>
          {userData?.email}
        </Text>
      </View>
      <View
        style={[
          globalStyles.horizontalDefaultPadding,
          globalStyles.verticalDefaultPadding,
        ]}>
        <FlatList
          data={menu}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={() => <Spacer height={15} />}
          renderItem={({item}) => (
            <Pressable
              onPress={() => {
                if (item.id === 5) {
                  _onLogout();
                } else if (item.id === 3) {
                  Linking.openURL('https://wa.me/+62 815-1568-40174');
                } else if (item.id === 1) {
                  navigation.navigate('Profile');
                }
              }}
              style={[
                globalStyles.row,
                globalStyles.alignCenter,
                globalStyles.justifySpaceBetween,
                {
                  paddingBottom: 8,
                  borderBottomWidth: 0.5,
                  borderBottomColor: GREY2,
                },
              ]}>
              <View style={[globalStyles.row, globalStyles.alignCenter]}>
                {item.icon}
                <Spacer width={10} />
                <Text style={[globalStyles.headingRegular.h3]}>
                  {item.name}
                </Text>
              </View>
              {item.isNavigate ? (
                <Ionicons name="caret-forward" size={24} color={GREY2} />
              ) : null}
            </Pressable>
          )}
        />
      </View>
    </BaseContainer>
  );
};

export default SettingsPage;

const styles = StyleSheet.create({});
