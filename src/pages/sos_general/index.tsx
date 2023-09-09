import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {BaseContainer, Button, Spacer, Toolbar} from 'components';
import {BLACK, GREY1, GREY2, PRIMARY, WHITE} from 'styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoutesParam} from 'routes/types';
import globalStyles from 'styles/globalStyles';
import userStore from 'store/userStore';
import {PostReport} from 'services/handler';
import Geolocation from '@react-native-community/geolocation';
import reportStore from 'store/reportStore';
import * as ImagePicker from 'react-native-image-picker';
import {PERMISSIONS, request} from 'react-native-permissions';
import {percentageHeight, percentageWidth} from 'utils/screen_size';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import WebView from 'react-native-webview';

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

  const [images, setImages] = useState<ImagePicker.Asset[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [generalState, setGeneralState] = useState({
    name: userData.full_name,
    email: userData.email,
    description: '',
    address: '',
  });
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const _onCameraPress = async () => {
    request(PERMISSIONS.ANDROID.CAMERA).then(async () => {
      const result = await ImagePicker.launchCamera({
        mediaType: 'photo',
        maxWidth: percentageWidth(100),
        maxHeight: 250,
      });
      console.log('result cam', result);
      actionSheetRef.current?.hide();
      const resultArr = result.assets;
      const mergedArray = [...images, ...resultArr!];
      setImages(mergedArray);
      // _onUploadImage(mergedArray);
    });
  };

  const _onGalleryPress = async () => {
    request(PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION).then(async () => {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        maxWidth: percentageWidth(100),
        maxHeight: 250,
      });
      console.log('result gallery', result.assets);
      actionSheetRef.current?.hide();
      const resultArr = result.assets;
      const mergedArray = [...images, ...resultArr!];
      // _onUploadImage(mergedArray);
      setImages(mergedArray);
    });
  };

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
        photo: images[0]?.base64 ?? '',
        location: generalState.address,
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
      <ScrollView contentContainerStyle={globalStyles.displayFlexGrow}>
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
            <Ionicons name="map" size={24} color={GREY2} />

            <Spacer width={10} />
            <View style={[globalStyles.displayFlex]}>
              <TextInput
                placeholder="Alamat Lengkap"
                placeholderTextColor={GREY2}
                multiline={true}
                numberOfLines={5}
                textAlignVertical="top"
                style={{paddingTop: 4}}
                onChangeText={(text: string) =>
                  setGeneralState({...generalState, address: text})
                }
              />
            </View>
          </View>
          <Spacer height={20} />

          <WebView
            startInLoadingState={true}
            scalesPageToFit={true}
            androidLayerType={'software'}
            source={{
              html: `<iframe src="https://maps.google.com/maps?q=${
                coords.latitude
              }, ${
                coords.longitude
              }&z=20&output=embed" frameborder="0" style="border:0; width: ${percentageWidth(
                200,
              )}px; height: ${percentageHeight(
                55,
              )}px; borderRadius:20"></iframe>`,
              baseUrl: 'https://maps.google.com/maps',
            }}
            onMessage={e => console.log('onMessage', e.nativeEvent.data)}
            style={{
              // marginTop: 20,
              width: percentageWidth(100),
              height: 240,
              borderRadius: 50,
              overflow: 'hidden',
              borderWidth: 5,
              elevation: 5,
            }}
            onError={error => console.error('errorwebview', error)}
          />
          <Spacer height={20} />
          <Pressable
            onPress={() => actionSheetRef.current?.show()}
            style={[
              globalStyles.justifyCenter,
              globalStyles.alignCenter,
              {
                width: 'auto',
                height: 240,
                borderRadius: 10,
                overflow: 'hidden',
                backgroundColor: GREY1,
              },
            ]}>
            {images.length === 0 ? (
              <>
                <MaterialIcons name="add-a-photo" size={50} color={WHITE} />
                <Text style={[globalStyles.headingBold.h3, {color: WHITE}]}>
                  Upload Foto
                </Text>
              </>
            ) : (
              <Image
                //   source={require('assets/images/logo.png')}
                source={{uri: images[0].uri}}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                }}
              />
            )}
          </Pressable>
          <ActionSheet ref={actionSheetRef}>
            <View
              style={[
                globalStyles.horizontalDefaultPadding,
                globalStyles.verticalDefaultPadding,
              ]}>
              <Text style={[globalStyles.headingBold.h3]}>
                Pilih Gambar Dari:
              </Text>
              <Pressable
                style={[globalStyles.row, globalStyles.alignCenter]}
                onPress={_onCameraPress}>
                <Ionicons name="camera" size={50} color={BLACK} />
                <Spacer width={10} />
                <Text style={[globalStyles.headingRegular.h3]}>Kamera</Text>
              </Pressable>
              <Spacer width={5} />
              <Pressable
                style={[globalStyles.row, globalStyles.alignCenter]}
                onPress={_onGalleryPress}>
                <Ionicons name="images" size={50} color={BLACK} />
                <Spacer width={10} />
                <Text style={[globalStyles.headingRegular.h3]}>Gallery</Text>
              </Pressable>
            </View>
          </ActionSheet>

          <Spacer height={20} />
          <Button
            text={
              isLoading ? (
                <ActivityIndicator color={WHITE} />
              ) : (
                'Proses Pengaduan'
              )
            }
            textColor={WHITE}
            containerStyle={[
              styles.btn,
              {
                backgroundColor:
                  generalState.description === '' || generalState.address === ''
                    ? GREY1
                    : PRIMARY,
              },
            ]}
            onPress={_onReport}
            disabled={
              generalState.description === '' ||
              generalState.address === '' ||
              isLoading
                ? true
                : false
            }
          />
        </View>
      </ScrollView>
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
