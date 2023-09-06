import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Linking,
  FlatList,
  StatusBar,
  ScrollView,
  RefreshControl,
  ListRenderItem,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {BaseContainer, Button, LoadingLogo, Spacer, Toolbar} from 'components';
import globalStyles from 'styles/globalStyles';
import {
  GREY2,
  PRIMARY,
  WHITE,
  BLACK,
  YELLOW,
  RED,
  GREY10,
  BLUE,
  GREY1,
  ORANGE,
} from 'styles/colors';
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
import categoriesStore, {ICategories} from 'store/categoriesStore';
import Geolocation from '@react-native-community/geolocation';
import reportStore, {IReportData} from 'store/reportStore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import moment from 'moment';
import {percentageWidth} from 'utils/screen_size';
import {UpdateReportByStatusID} from 'services/handler';

const Home = () => {
  const navigation = useNavigation<StackNavigationProp<RoutesParam, 'Home'>>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {userData, _getUserData, isLoading} = userStore();
  const {loginData} = authStore();
  console.log('loginData', loginData);
  const {categoryList, _getCategories} = categoriesStore();

  const {
    isLoading: isReportLoading,
    _getAllReports,
    reportData,
  } = reportStore();

  console.log('userData', userData);

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
  }, []);

  useEffect(() => {
    if (loginData?.role !== 'user') {
      _getAllReports();
    }
  }, [loginData?.role]);

  const [newCategList, setNewCategList] = useState(categoryList);

  console.log('categories', categoryList);

  useEffect(() => {
    if (categoryList?.length > 0) {
      const dat = [...categoryList];
      let newArray: ICategories[] = [];
      dat.map(o => {
        let item = {
          ...o,
          navigate:
            o.id === 1 ? 'SOSGeneral' : o.id === 2 ? 'SOSFire' : 'SOSPublic',
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
        };
        newArray.push(item);
      });
      setNewCategList(newArray);
    }
  }, [categoryList?.length]);

  const _onAcceptTask = (reportID: number, id: number) => {
    UpdateReportByStatusID(reportID, loginData?.user_id!, id === 1 ? 2 : 3)
      .then(res => {
        if (res?.status === 200) {
          _getAllReports();
        }
      })
      .catch(err => {
        Alert.alert('Error', err.toString());
      });
  };

  const _onCompleteTask = (reportID: number, id: number) => {
    UpdateReportByStatusID(reportID, loginData?.user_id!, id === 1 ? 2 : 3)
      .then(res => {
        if (res?.status === 200) {
          _getAllReports();
        }
      })
      .catch(err => {
        Alert.alert('Error', err.toString());
      });
  };

  const renderItem: ListRenderItem<IReportData> = ({item}) => (
    <View
      style={[globalStyles.displayFlex, globalStyles.horizontalDefaultPadding]}>
      <View
        style={[
          globalStyles.horizontalDefaultPadding,
          globalStyles.verticalDefaultPadding,
          globalStyles.alignStart,
          {
            borderRadius: 5,
            backgroundColor: GREY10,
            width: percentageWidth(70),
            elevation: 10,
          },
        ]}>
        <View
          style={[
            globalStyles.row,
            globalStyles.justifySpaceBetween,
            globalStyles.alignCenter,
            {width: '100%'},
          ]}>
          <View
            style={[
              globalStyles.horizontalDefaultPadding,
              {
                backgroundColor:
                  item.status_id === 2
                    ? PRIMARY
                    : item.status_id === 1
                    ? YELLOW
                    : RED,
                borderRadius: 5,
              },
            ]}>
            <Text style={[globalStyles.headingBlack.h3, {color: WHITE}]}>
              {item.status_name}
            </Text>
          </View>
          <Text style={[globalStyles.bodyBlack.h2, {color: GREY2}]}>
            {moment(item.created_at).format('DD MMMM YYYY')}
          </Text>
        </View>

        <View>
          <Text style={[globalStyles.headingBlack.h3]}>
            {item.category_name}
          </Text>
        </View>
        <View style={[globalStyles.row, globalStyles.alignCenter]}>
          <FontAwesome name="map-marker" size={24} color={BLACK} />
          <Spacer width={10} />
          <Text style={[globalStyles.headingRegular.h3]}>
            {item.description}
          </Text>
        </View>
        <Spacer height={15} />
        {item.status_id === 1 && loginData?.role === 'petugas' && (
          <Button
            text="Ambil Tugas"
            textColor={PRIMARY}
            textStyle={globalStyles.headingBold.h3}
            containerStyle={{
              backgroundColor: 'lightgreen',
              width: '100%',
              borderRadius: 8,
            }}
            onPress={() =>
              Alert.alert(
                'Perhatian',
                'Apakah anda yakin ingin mengambil tugas ini?',
                [
                  {
                    text: 'Tidak',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Ya',
                    onPress: () => _onAcceptTask(item.id, item.status_id),
                  },
                ],
              )
            }
          />
        )}
        {item.status_id === 2 && loginData?.role === 'petugas' && (
          <Button
            text="Tugas Selesai"
            textColor={PRIMARY}
            textStyle={globalStyles.headingBold.h3}
            containerStyle={{
              backgroundColor: 'lightgreen',
              width: '100%',
              borderRadius: 8,
            }}
            onPress={() =>
              Alert.alert('Perhatian', 'Apakah tugas sudah selesai?', [
                {
                  text: 'Tidak',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Ya',
                  onPress: () => _onCompleteTask(item.id, item.status_id),
                },
              ])
            }
          />
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return <LoadingLogo />;
  }

  return (
    <BaseContainer
      scrollable
      style={[globalStyles.displayFlex, {backgroundColor: WHITE}]}>
      <StatusBar
        backgroundColor={settings.statusBarColor}
        barStyle="light-content"
      />
      <Toolbar
        prefix={
          <View style={[globalStyles.row, globalStyles.alignCenter]}>
            <Image
              source={
                userData?.photo === null ||
                userData?.photo === '' ||
                userData?.photo === undefined
                  ? require('assets/images/logo.png')
                  : {uri: userData?.photo}
              }
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
      <ScrollView
        contentContainerStyle={[globalStyles.displayFlexGrow]}
        nestedScrollEnabled>
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
            {loginData?.role === 'petugas'
              ? 'Daftar Pengaduan Terkini'
              : 'Anda Butuh Bantuan?'}
          </Text>
          <Spacer height={10} />
          {loginData?.role !== 'petugas' && (
            <Text
              style={[
                globalStyles.headingRegular.h3,
                globalStyles.textAlignCenter,
                {color: GREY2},
              ]}>
              Tekan tombol SOS untuk mengirimkan aduan dengan lokasi anda saat
              ini
            </Text>
          )}
          {loginData?.role !== 'petugas' && (
            <>
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
                <Text style={[globalStyles.headingBold.h1, {color: WHITE}]}>
                  SOS
                </Text>
              </Pressable>
            </>
          )}

          {reportData?.length > 0 && loginData?.role === 'petugas' ? (
            <>
              <Spacer height={30} />
              <FlatList
                data={reportData.slice(0, 3)}
                // data={[]}
                keyExtractor={item => item?.id.toString()}
                renderItem={renderItem}
                horizontal
                style={{maxHeight: 210}}
                refreshControl={
                  <RefreshControl
                    onRefresh={_getAllReports}
                    refreshing={isLoading}
                  />
                }
              />
            </>
          ) : null}

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
              onPress={() =>
                Linking.openURL(`https://wa.me/+62 815-1568-40174`)
              }
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
      </ScrollView>
    </BaseContainer>
  );
};

export default Home;

const styles = StyleSheet.create({});
