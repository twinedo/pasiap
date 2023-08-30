import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {BaseContainer, Button, Spacer, Toolbar} from 'components';
import {WHITE, PRIMARY, GREY1, GREY2} from 'styles/colors';
import globalStyles from 'styles/globalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import userStore from 'store/userStore';

const Information = () => {
  const {userData} = userStore();
  const data = [
    {
      id: 1,
      title: 'Information',
      subtitle: 'Information subtitle',
      description: 'Information description',
      date: '01-01-2023',
    },
    {
      id: 2,
      title: 'Information',
      subtitle: 'Information subtitle',
      description: 'Information description',
      date: '01-01-2023',
    },
    {
      id: 3,
      title: 'Information',
      subtitle: 'Information subtitle',
      description: 'Information description',
      date: '01-01-2023',
    },
    {
      id: 4,
      title: 'Information',
      subtitle: 'Information subtitle',
      description: 'Information description',
      date: '01-01-2023',
    },
  ];
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
        <FlatList
          data={[]}
          // keyExtractor={item => item?.id.toString()}
          renderItem={({item}) => (
            <View>
              {/* <Text style={[globalStyles.headingBlack.h3]}>{item.title}</Text> */}
            </View>
          )}
          ItemSeparatorComponent={() => <Spacer height={20} />}
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
              <Text style={[globalStyles.headingRegular.h3, {color: PRIMARY}]}>
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
              />
            </View>
          }
        />
      </View>
    </BaseContainer>
  );
};

export default Information;

const styles = StyleSheet.create({});
