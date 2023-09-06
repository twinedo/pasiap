import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  ListRenderItem,
  RefreshControl,
  Alert,
} from 'react-native';
import React, {useEffect} from 'react';
import {BaseContainer, Toolbar, Spacer, Button, LoadingLogo} from 'components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  WHITE,
  PRIMARY,
  GREY2,
  BLACK,
  GREY1,
  GREEN1,
  BLUE,
  GREY10,
  YELLOW,
  RED,
} from 'styles/colors';
import globalStyles from 'styles/globalStyles';
import reportStore, {IReportData} from 'store/reportStore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import moment from 'moment';
import userStore from 'store/userStore';
import authStore from 'store/authStore';
import {UpdateReportByStatusID} from 'services/handler';

const History = () => {
  const {isLoading, _getAllReports, reportData} = reportStore();
  const {userData} = userStore();
  const {loginData} = authStore();

  useEffect(() => {
    _getAllReports();

    return () => {};
  }, []);

  console.log('reportData', reportData);

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
    <View style={[globalStyles.row]}>
      <View style={[{width: 60}]}>
        <Text style={[globalStyles.headingBlack.h1]}>
          {moment(item.created_at).format('DD')}{' '}
          <Text style={[{color: GREY1}]}>
            {moment(item.created_at).format('MMM YY')}
          </Text>
        </Text>
      </View>
      <View style={[globalStyles.alignCenter]}>
        <FontAwesome6 name="circle-dot" color={BLUE} size={24} />

        <View
          style={{
            height:
              (item.status_id === 1 || item.status_id === 2) &&
              loginData?.role === 'petugas'
                ? 200
                : 150,
            width: 2,
            backgroundColor: GREY10,
          }}
        />
      </View>
      <View
        style={[
          globalStyles.displayFlex,
          globalStyles.horizontalDefaultPadding,
          // globalStyles.verticalDefaultPadding,
        ]}>
        <View
          style={[
            globalStyles.horizontalDefaultPadding,
            globalStyles.verticalDefaultPadding,
            globalStyles.alignStart,
            {borderRadius: 5, backgroundColor: GREY10, elevation: 10},
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
          <Spacer height={10} />
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
    </View>
  );

  return (
    <BaseContainer>
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
      <View
        style={[
          globalStyles.displayFlex,
          globalStyles.horizontalDefaultPadding,
          globalStyles.verticalDefaultPadding,
        ]}>
        {isLoading ? (
          <LoadingLogo />
        ) : (
          <FlatList
            data={reportData}
            keyExtractor={item => item?.id.toString()}
            renderItem={renderItem}
            // ItemSeparatorComponent={() => <Spacer height={20} />}
            contentContainerStyle={[globalStyles.displayFlexGrow]}
            ListEmptyComponent={
              <View
                style={[
                  globalStyles.displayFlex,
                  globalStyles.justifyCenter,
                  globalStyles.alignCenter,
                ]}>
                <MaterialCommunityIcons
                  name="clipboard-text-search"
                  size={60}
                  color={PRIMARY}
                />
                <Text
                  style={[globalStyles.headingRegular.h3, {color: PRIMARY}]}>
                  Belum ada Pengaduan
                </Text>
                <Text
                  style={[
                    globalStyles.headingRegular.h3,
                    globalStyles.textAlignCenter,
                    {color: GREY2},
                  ]}>
                  Maaf, saat ini kami tidak ada menemukan data pengaduan yang
                  dibuat oleh anda
                </Text>
                <Spacer height={20} />
                <Button
                  text="Refresh Data"
                  textColor={WHITE}
                  containerStyle={[
                    globalStyles.horizontalDefaultPadding,
                    {backgroundColor: PRIMARY, borderRadius: 8},
                  ]}
                  onPress={_getAllReports}
                />
              </View>
            }
            refreshControl={
              <RefreshControl
                onRefresh={_getAllReports}
                refreshing={isLoading}
              />
            }
          />
        )}
      </View>
    </BaseContainer>
  );
};

export default History;

const styles = StyleSheet.create({});
