import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Alert,
  Pressable,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {BaseContainer, Button, LoadingLogo, Spacer, Toolbar} from 'components';
import {
  WHITE,
  PRIMARY,
  GREY1,
  GREY2,
  SOFTGREEN,
  BLACK,
  BLUE2,
  RED,
} from 'styles/colors';
import globalStyles from 'styles/globalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import userStore from 'store/userStore';
import informationStore, {IInformation} from 'store/informationStore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoutesParam} from 'routes/types';
import moment from 'moment';
import authStore from 'store/authStore';
import {DeleteInformation} from 'services/handler';
import {DEFAULT_ARTICLE_STORAGE} from '@env';

const Information = () => {
  const navigation =
    useNavigation<StackNavigationProp<RoutesParam, 'InformationForm'>>();
  const {userData} = userStore();
  const {loginData} = authStore();
  const {isLoading, _getInformation, informationList} = informationStore();

  useFocusEffect(
    useCallback(() => {
      _getInformation();
    }, []),
  );

  const renderItem: ListRenderItem<IInformation> = ({item}) => (
    <Pressable
      onPress={() => navigation.navigate('InformationView', {data: item})}
      style={[
        globalStyles.displayFlex,
        globalStyles.horizontalDefaultPadding,
        globalStyles.verticalDefaultPadding,
        {borderRadius: 8, backgroundColor: WHITE, elevation: 2},
      ]}>
      {item.cover !== DEFAULT_ARTICLE_STORAGE ? (
        <Image
          source={{uri: item.cover}}
          style={{width: 'auto', height: 200, borderRadius: 8}}
        />
      ) : null}
      <Text style={[globalStyles.headingBold.h2]}>{item?.title}</Text>
      <Text
        numberOfLines={3}
        ellipsizeMode="tail"
        style={[globalStyles.headingRegular.h3]}>
        {item?.description}
      </Text>
      <Spacer height={8} />
      <View
        style={[
          globalStyles.displayFlex,
          globalStyles.row,
          globalStyles.alignCenter,
          globalStyles.justifySpaceBetween,
        ]}>
        <Text
          style={[
            globalStyles.headingRegular.h3,
            {
              color: BLACK,
              padding: 8,
              borderRadius: 8,
              backgroundColor: SOFTGREEN,
            },
          ]}>
          {item?.category}
        </Text>
        <Text style={[globalStyles.headingRegular.h3, {color: GREY1}]}>
          {moment(item?.created_at).format('DD MMMM YYYY')}
        </Text>
      </View>
      <Spacer height={20} />
      {loginData?.role === 'admin' ? (
        <View style={[globalStyles.row, {columnGap: 20}]}>
          <Button
            text="Edit"
            textColor={WHITE}
            containerStyle={[
              globalStyles.horizontalDefaultPadding,
              {backgroundColor: BLUE2, elevation: 5, width: '45%'},
            ]}
            onPress={() =>
              navigation.navigate('InformationForm', {
                params: 'update',
                data: item,
              })
            }
          />
          <Button
            text="Delete"
            textColor={WHITE}
            containerStyle={[
              globalStyles.horizontalDefaultPadding,
              {backgroundColor: RED, elevation: 5, width: '45%'},
            ]}
            onPress={() =>
              Alert.alert(
                'Perhatian',
                'Apakah anda yakin ingin menghapus artikel ini?',
                [
                  {
                    text: 'Tidak',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Ya',
                    onPress: () =>
                      DeleteInformation(item?.id!).then(res => {
                        if (res?.status === 200) {
                          _getInformation();
                        }
                      }),
                  },
                ],
              )
            }
          />
        </View>
      ) : null}
    </Pressable>
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
        postfix={
          loginData?.role === 'admin' ? (
            <MaterialCommunityIcons
              onPress={() =>
                navigation.navigate('InformationForm', {
                  params: 'add',
                  data: {
                    title: '',
                    description: '',
                    category: 'umum',
                    cover: '',
                    is_publish: true,
                  },
                })
              }
              name="plus"
              size={32}
              color={WHITE}
            />
          ) : null
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
            data={informationList}
            // keyExtractor={item => item?.id.toString()}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <Spacer height={20} />}
            contentContainerStyle={[
              globalStyles.displayFlexGrow,
              globalStyles.horizontalDefaultPadding,
              globalStyles.verticalDefaultPadding,
            ]}
            refreshControl={
              <RefreshControl
                onRefresh={_getInformation}
                refreshing={isLoading}
              />
            }
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
                  Data tidak tersedia
                </Text>
                <Text
                  style={[
                    globalStyles.headingRegular.h3,
                    globalStyles.textAlignCenter,
                    {color: GREY2},
                  ]}>
                  Maaf, saat ini kami tidak ada menemukan data yang dapat
                  diinformasikan kepada anda
                </Text>
                <Spacer height={20} />
                <Button
                  text="Refresh Data"
                  textColor={WHITE}
                  containerStyle={[
                    globalStyles.horizontalDefaultPadding,
                    {backgroundColor: PRIMARY, borderRadius: 8},
                  ]}
                  onPress={_getInformation}
                />
                <Spacer height={20} />
                {loginData?.role === 'petugas' ? (
                  <Button
                    text="Tambah Informasi"
                    textColor={WHITE}
                    containerStyle={[
                      globalStyles.horizontalDefaultPadding,
                      {backgroundColor: PRIMARY, borderRadius: 8},
                    ]}
                    onPress={() => navigation.navigate('InformationForm')}
                  />
                ) : null}
              </View>
            }
          />
        )}
      </View>
    </BaseContainer>
  );
};

export default Information;

const styles = StyleSheet.create({});
