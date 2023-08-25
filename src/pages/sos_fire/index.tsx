import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {BaseContainer, Button, Spacer, Toolbar} from 'components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BLACK, GREY1, GREY2, PRIMARY, WHITE} from 'styles/colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoutesParam} from 'routes/types';
import globalStyles from 'styles/globalStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {percentageWidth} from 'utils/screen_size';
import {PERMISSIONS, request} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import userStore from 'store/userStore';
import {PostReport} from 'services/handler';
import {Dirs, FileSystem} from 'react-native-file-access';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_MAIN} from '@env';
import {useAxios} from 'services/useAxios';
import {fetchAPI} from 'services/fetch';
import authStore from 'store/authStore';
import {Form, Formik} from 'formik';
// import fs from 'fs';

const SOSFire = () => {
  const navigation =
    useNavigation<StackNavigationProp<RoutesParam, 'SOSFire'>>();
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const route = useRoute();
  const {loginData} = authStore();
  const {data} = route.params;
  const {userData} = userStore();
  const [images, setImages] = useState<ImagePicker.Asset[]>([]);
  const [coords, setCoords] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

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
      FileSystem.exists(mergedArray[0].uri)
        .then(res => {
          console.log('exists', res);
        })
        .catch(err => {
          console.error('doesnt exists', err);
        });
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
      FileSystem.exists(mergedArray[0].uri)
        .then(res => {
          console.log('exists', res);
        })
        .catch(err => {
          console.error('doesnt exists', err);
        });
      setImages(mergedArray);
    });
  };

  const _onReport = () => {
    setIsLoading(true);

    // const statFile = await FileSystem.stat(images[0]?.uri);
    // console.log('statFile', statFile);
    console.log('images', images[0]);
    var myHeaders = new Headers();
    myHeaders.append(
      'Content-Type',
      'multipart/form-data; charset=utf-8; boundary=' +
        Math.random().toString().substr(2),
    );
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${loginData?.token}`);

    var formData = new FormData();
    formData.append('cat_id', '2');
    formData.append('reported_by', '3');
    formData.append('lat', '12345');
    formData.append('long', '54321');
    formData.append('description', 'Kebakaran bang');
    formData.append('status', '1');
    formData.append('photo', {
      uri: images[0].uri,
      name: images[0].fileName,
      mime: images[0].type,
      // type: statFile.type,
      // mimes: images[0].type,
    });

    // console.log('uri', images[0].uri);
    // console.log('type', images[0].type);
    // console.log('fileName', images[0].fileName);
    // try {
    fetch(`${API_MAIN}/reports`, {
      method: 'post',
      body: formData,
      // headers: {
      //   'Content-Type':
      //     'multipart/form-data; charset=utf-8; boundary=' +
      //     Math.random().toString().substr(2),
      //   Authorization: `Bearer ${loginData?.token}`,
      // },
      headers: myHeaders,
    })
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error))
      .finally(() => setIsLoading(false));
    // console.log('res upload', response);
    // } catch (error) {
    //   console.error(error);
    //   console.error('API Error:', error);

    //   // Log the specific error message and details
    //   console.error('Error Message:', error.message);
    //   console.error('Error Details:', error.toJSON());
    // } finally {
    //   setIsLoading(false);
    // }
    // PostReport(
    //   {
    //     cat_id: data.id,
    //     reported_by: userData.user_id,
    //     lat: coords.latitude,
    //     long: coords.longitude,
    //     description: 'Kebakaran',
    //     status: 1,
    //     // photo: images[0].uri,
    //     photo: 'https://blog.idrsolutions.com/app/uploads/2017/02/JPEG-1.png',
    //   },
    //   {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // )
    //   .then(res => {
    //     console.log(res);
    //     if (res?.status === 200) {
    //       Alert.alert('Sukses', 'Berhasil membuat Pengaduan Kebakaran', [
    //         {
    //           text: 'OK',
    //           onPress: () => navigation.goBack(),
    //           style: 'default',
    //         },
    //       ]);
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
    //   .finally(() => setIsLoading(false));
    // }
  };

  return (
    <BaseContainer>
      <Toolbar
        text="Pengaduan Kebakaran"
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
        <Formik initialValues={{}} onSubmit={_onReport}>
          {({}) => (
            <>
              <View
                style={[
                  globalStyles.row,
                  globalStyles.alignCenter,
                  globalStyles.horizontalDefaultPadding,
                  {
                    backgroundColor: GREY1,
                    width: '100%',
                    height: 40,
                    borderRadius: 5,
                  },
                ]}>
                <Ionicons name="person" size={24} color={GREY2} />
                <Spacer width={10} />
                <View style={globalStyles.displayFlex}>
                  <TextInput
                    placeholder="Nama Anda"
                    placeholderTextColor={GREY2}
                    value={userData?.full_name}
                  />
                </View>
              </View>
              <Spacer height={15} />
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
                      Upload Foto Kebakaran
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
              <Spacer height={30} />
              <Pressable
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
                ]}
              />
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
                    backgroundColor: images.length === 0 ? GREY1 : PRIMARY,
                  },
                ]}
                onPress={_onReport}
                disabled={images.length === 0 || isLoading ? true : false}
              />
            </>
          )}
        </Formik>
      </View>
      <ActionSheet ref={actionSheetRef}>
        <View
          style={[
            globalStyles.horizontalDefaultPadding,
            globalStyles.verticalDefaultPadding,
          ]}>
          <Text style={[globalStyles.headingBold.h3]}>Pilih Gambar Dari:</Text>
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
    </BaseContainer>
  );
};

export default SOSFire;

const styles = StyleSheet.create({
  btn: {
    borderRadius: 10,
    height: 50,
    width: '100%',
  },
});
