import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Linking,
  FlatList,
  StatusBar,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {BaseContainer, LoadingLogo, Spacer, Toolbar} from 'components';
import globalStyles from 'styles/globalStyles';
import {GREY2, PRIMARY, WHITE, BLACK} from 'styles/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import settingStore from 'store/settingStore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoutesParam} from 'routes/types';
import userStore from 'store/userStore';
import authStore from 'store/authStore';
import categoriesStore, { ICategories } from 'store/categoriesStore';
import Geolocation from '@react-native-community/geolocation';

const Home = () => {
  const navigation = useNavigation<StackNavigationProp<RoutesParam, 'Home'>>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {userData, _getUserData, isLoading} = userStore();
  const { loginData } = authStore();
  const { categoryList, _getCategories} = categoriesStore();

  console.log('userData', userData);
  const layanan = [
    {
      id: 1,
      name: 'Pengaduan Kebakaran',
      icon: (
        <MaterialCommunityIcons name="fire-truck" color={WHITE} size={32} />
      ),
      navigate: 'SOSFire',
    },
    {
      id: 2,
      name: 'Pengaduan Umum',
      icon: (
        <MaterialCommunityIcons name="information" color={WHITE} size={32} />
      ),
      navigate: 'SOSGeneral',
    },
    {
      id: 3,
      name: 'Pengaduan Layanan Masyarakat',
      icon: <Ionicons name="warning" color={WHITE} size={32} />,
      navigate: 'SOSPublic',
    },
  ];

  const {changeStatusBar, settings} = settingStore();

  useFocusEffect(
    useCallback(() => {
      changeStatusBar(PRIMARY);
    }, [settings.statusBarColor]),
  );

  useEffect(() => {
    if (userData?.user_id === 0) {
      _getUserData();

    }

    return () => {};
  }, [userData?.user_id!]);

  useEffect(() => {
    _getCategories();
    Geolocation.requestAuthorization();
  }, [])


  const [newCategList, setNewCategList] = useState(categoryList);

  console.log('categories', categoryList)

  useEffect(() => {
    if (categoryList?.length > 0) {
      const dat = [...categoryList];
      let newArray:ICategories[] = [];
      dat.map(o => {
        let item = {
          ...o,
          navigate: o.id === 1 ? 'SOSGeneral' : o.id === 2 ? 'SOSFire' : 'SOSPublic',
          icon:
            o.id === 1 ? (
              <MaterialCommunityIcons
                name="information"
                color={WHITE}
                size={32}
              />
            ) : o.id === 2 ? (
              <MaterialCommunityIcons
                name="fire-truck"
                color={WHITE}
                size={32}
              />
            ) : (
              <Ionicons name="warning" color={WHITE} size={32} />
            ),
        }
        newArray.push(item);
      });
      setNewCategList(newArray);
    }
  }, [categoryList?.length])

  if (isLoading) {
    return <LoadingLogo />;
  }

  return (
    <BaseContainer style={[globalStyles.displayFlex, {backgroundColor: WHITE}]}>
      <StatusBar
        backgroundColor={settings.statusBarColor}
        barStyle="light-content"
      />
      <Toolbar
        prefix={
          <View style={[globalStyles.row, globalStyles.alignCenter]}>
            <Image
              source={require('assets/images/logo.png')}
              style={{width: 40, height: 40, borderRadius: 50}}
            />
            <Spacer width={10} />
            <Text style={[globalStyles.headingBold.h3, {color: WHITE}]}>
              {userData?.full_name}
            </Text>
          </View>
        }
        containerStyle={{backgroundColor: PRIMARY}}
      />
      <View
        style={[
          globalStyles.displayFlex,
          globalStyles.horizontalDefaultPadding,
          globalStyles.verticalDefaultPadding,
          globalStyles.alignCenter,
          globalStyles.justifyCenter,
          {backgroundColor: WHITE},
        ]}>
        <Text style={[globalStyles.headingBold.h2, {color: PRIMARY}]}>
          Anda Butuh Bantuan?
        </Text>
        <Spacer height={10} />
        <Text
          style={[
            globalStyles.headingRegular.h3,
            globalStyles.textAlignCenter,
            {color: GREY2},
          ]}>
          Tekan tombol SOS untuk mengirimkan aduan dengan lokasi anda saat ini
        </Text>
        <Spacer height={30} />
        <Pressable
          onPress={() => setIsModalVisible(true)}
          style={[
            globalStyles.justifyCenter,
            globalStyles.alignCenter,
            {
              width: 100,
              height: 100,
              backgroundColor: PRIMARY,
              borderRadius: 100,
            },
          ]}>
          <Text style={[globalStyles.headingBold.h1, {color: WHITE}]}>SOS</Text>
        </Pressable>
        <Spacer height={30} />
        <Text style={[globalStyles.headingBold.h2, {color: PRIMARY}]}>
          Hubungi Kami dengan Cara
        </Text>
        <Spacer height={10} />
        <Text
          style={[
            globalStyles.headingRegular.h3,
            globalStyles.textAlignCenter,
            {color: GREY2},
          ]}>
          Tekan tombol SOS untuk mengirimkan aduan dengan lokasi anda saat ini
        </Text>
        <Spacer height={10} />
        <View
          style={[
            globalStyles.row,
            // globalStyles.alignCenter,
            globalStyles.justifyAround,
          ]}>
          <Pressable
            onPress={() => Linking.openURL(`tel:06355510003`)}
            style={[
              // globalStyles.horizontalDefaultPadding,
              globalStyles.verticalDefaultPadding,
              globalStyles.justifyCenter,
              globalStyles.alignCenter,
              {
                borderWidth: 3,
                borderRadius: 10,
                borderColor: PRIMARY,
                width: '40%',
              },
            ]}>
            <MaterialIcons name="phone-in-talk" size={32} color={PRIMARY} />
            <Spacer height={5} />
            <Text style={[globalStyles.headingRegular.h3, {color: PRIMARY}]}>
              Emergency Call
            </Text>
          </Pressable>
          <Spacer width={30} />
          <Pressable
            onPress={() => Linking.openURL(`'https://wa.me/+62 815-1568-40174'`)}
            style={[
              // globalStyles.horizontalDefaultPadding,
              globalStyles.verticalDefaultPadding,
              globalStyles.justifyCenter,
              globalStyles.alignCenter,
              {
                borderWidth: 3,
                borderRadius: 10,
                borderColor: PRIMARY,
                width: '40%',
              },
            ]}>
            <Ionicons name="logo-whatsapp" size={32} color={PRIMARY} />
            <Spacer height={5} />
            <Text style={[globalStyles.headingRegular.h3, {color: PRIMARY}]}>
              WhatsApp
            </Text>
          </Pressable>
          <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => setIsModalVisible(!isModalVisible)}
            onBackButtonPress={() => setIsModalVisible(!isModalVisible)}
            animationIn="fadeInUp"
            animationOut="fadeOutDown"
            useNativeDriver>
            <View
              style={[globalStyles.displayFlex, globalStyles.justifyCenter]}>
              <View
                style={[
                  globalStyles.horizontalDefaultPadding,
                  globalStyles.verticalDefaultPadding,
                  {borderRadius: 10, backgroundColor: WHITE},
                ]}>
                <Text
                  style={[
                    globalStyles.textAlignCenter,
                    globalStyles.headingBlack.h3,
                  ]}>
                  LAYANAN SOS
                </Text>
                <Spacer height={20} />
                <FlatList
                  data={newCategList}
                  keyExtractor={item => item.id.toString()}
                  ItemSeparatorComponent={() => <Spacer height={20} />}
                  renderItem={({item}) => (
                    <Pressable
                      onPress={() => {
                        setIsModalVisible(false);
                        navigation.navigate(item.navigate, {data: item});
                      }}
                      style={[
                        globalStyles.row,
                        globalStyles.alignCenter,
                        globalStyles.horizontalDefaultPadding,
                        globalStyles.verticalDefaultPadding,
                        {backgroundColor: PRIMARY, borderRadius: 8},
                      ]}>
                      {item.icon}
                      <Spacer width={20} />
                      <Text
                        style={[globalStyles.headingBold.h3, {color: WHITE}]}>
                        {item.name}
                      </Text>
                    </Pressable>
                  )}
                />
                <Spacer height={20} />
              </View>
              <Spacer height={25} />
              <Pressable
                onPress={() => setIsModalVisible(false)}
                style={[
                  globalStyles.justifyCenter,
                  globalStyles.alignCenter,

                  {
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: WHITE,
                    alignSelf: 'center',
                  },
                ]}>
                <Ionicons name="close" size={32} color={BLACK} />
              </Pressable>
            </View>
          </Modal>
        </View>
      </View>
    </BaseContainer>
  );
};

export default Home;

const styles = StyleSheet.create({});
