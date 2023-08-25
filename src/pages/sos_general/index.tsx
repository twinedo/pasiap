import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BaseContainer, Button, Spacer, Toolbar} from 'components';
import {GREY1, GREY2, PRIMARY, WHITE} from 'styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoutesParam} from 'routes/types';
import globalStyles from 'styles/globalStyles';
import userStore from 'store/userStore';
import {PostReport} from 'services/handler';
import Geolocation from '@react-native-community/geolocation';
import reportStore from 'store/reportStore';

const SOSGeneral = () => {
  const navigation =
    useNavigation<StackNavigationProp<RoutesParam, 'SOSGeneral'>>();
  const route = useRoute<RouteProp<RoutesParam, 'SOSGeneral'>>();
  const {_getAllReports} = reportStore();
  const {data} = route.params;

  const {userData} = userStore();
  const [coords, setCoords] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [generalState, setGeneralState] = useState({
    name: userData.full_name,
    email: userData.email,
    description: '',
  });

  useEffect(() => {
    Geolocation.getCurrentPosition(
      success => {
        console.log('Geolocation successfully', success);
        const {latitude, longitude} = success.coords;
        setCoords({latitude, longitude});
      },
      error => {
        console.log('error Geolocation: ' + error);
        Alert.alert(error.message.toString());
      },
      {
        enableHighAccuracy: true,
      },
    );

    return () => {};
  }, []);

  const _onReport = () => {
    setIsLoading(true);
    if (generalState.description.length === 0) {
      Alert.alert('Perhatian', 'Data harus diisi');
    } else {
      PostReport({
        cat_id: data.id,
        reported_by: userData.user_id,
        lat: coords.latitude,
        long: coords.longitude,
        description: generalState.description,
        status: 1,
      })
        .then(res => {
          console.log(res);
          if (res?.status === 200) {
            _getAllReports();
            Alert.alert('Sukses', 'Berhasil membuat Pengaduan Umum', [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
                style: 'default',
              },
            ]);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <BaseContainer>
      <Toolbar
        text="Pengaduan Umum"
        textStyle={{color: WHITE}}
        containerStyle={{backgroundColor: PRIMARY}}
        prefix={
          <Ionicons
            name="chevron-back"
            size={24}
            color={WHITE}
            onPress={() => navigation.goBack()}
          />
        }
      />
      <View
        style={[
          globalStyles.horizontalDefaultPadding,
          globalStyles.verticalDefaultPadding,
          globalStyles.displayFlex,
        ]}>
        <Text style={[globalStyles.headingRegular.h3]}>
          Silahkan lengkapi data pengaduan dibawah
        </Text>
        <Spacer height={15} />
        <View
          style={[
            globalStyles.row,
            globalStyles.alignCenter,
            globalStyles.horizontalDefaultPadding,
            styles.inputContainer,
          ]}>
          <Ionicons name="person" size={24} color={GREY2} />
          <Spacer width={10} />
          <View style={globalStyles.displayFlex}>
            <TextInput
              placeholder="Nama Anda"
              placeholderTextColor={GREY2}
              value={generalState.name}
              editable={false}
            />
          </View>
        </View>
        <Spacer height={15} />
        <View
          style={[
            globalStyles.row,
            globalStyles.alignCenter,
            globalStyles.horizontalDefaultPadding,
            styles.inputContainer,
          ]}>
          <Ionicons name="mail" size={24} color={GREY2} />
          <Spacer width={10} />
          <View style={globalStyles.displayFlex}>
            <TextInput
              placeholder="Email Anda"
              placeholderTextColor={GREY2}
              value={generalState.email}
              editable={false}
            />
          </View>
        </View>
        <Spacer height={15} />
        <View
          style={[
            globalStyles.row,
            globalStyles.alignStart,
            globalStyles.horizontalDefaultPadding,
            globalStyles.verticalDefaultPadding,
            {
              backgroundColor: GREY1,
              width: '100%',
              borderRadius: 5,
            },
          ]}>
          <Ionicons name="document-text-outline" size={24} color={GREY2} />

          <Spacer width={10} />
          <View style={[globalStyles.displayFlex]}>
            <TextInput
              placeholder="Deskripsi"
              placeholderTextColor={GREY2}
              multiline={true}
              numberOfLines={5}
              textAlignVertical="top"
              style={{paddingTop: 4}}
              onChangeText={(text: string) =>
                setGeneralState({...generalState, description: text})
              }
            />
          </View>
        </View>
        <Spacer height={20} />
        <Button
          text={
            isLoading ? <ActivityIndicator color={WHITE} /> : 'Proses Pengaduan'
          }
          textColor={WHITE}
          containerStyle={[
            styles.btn,
            {
              backgroundColor:
                generalState.description === '' ? GREY1 : PRIMARY,
            },
          ]}
          onPress={_onReport}
          disabled={generalState.description === '' || isLoading ? true : false}
        />
      </View>
    </BaseContainer>
  );
};

export default SOSGeneral;

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: GREY1,
    width: '100%',
    height: 40,
    borderRadius: 5,
  },
  btn: {
    borderRadius: 10,
    height: 50,
    width: '100%',
  },
});
