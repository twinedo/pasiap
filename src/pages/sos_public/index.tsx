import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {BaseContainer, Button, Spacer, Toolbar} from 'components';
import {BLACK, GREY1, GREY2, PRIMARY, WHITE} from 'styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import globalStyles from 'styles/globalStyles';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoutesParam} from 'routes/types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {PERMISSIONS, request} from 'react-native-permissions';
import * as ImagePicker from 'react-native-image-picker';
import {percentageWidth} from 'utils/screen_size';
import userStore from 'store/userStore';
import Geolocation from '@react-native-community/geolocation';
import {PostReport} from 'services/handler';

const SOSPublic = () => {
  const navigation =
    useNavigation<StackNavigationProp<RoutesParam, 'SOSPublic'>>();
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [images, setImages] = useState<ImagePicker.Asset[]>([]);
  const {userData} = userStore();
  const route = useRoute<RouteProp<RoutesParam, 'SOSPublic'>>();
  const {data} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [coords, setCoords] = useState({
    latitude: 0,
    longitude: 0,
  });

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

  const _onReport = () => {
    setIsLoading(true);

    PostReport({
      cat_id: data.id,
      reported_by: userData.user_id,
      lat: coords.latitude,
      long: coords.longitude,
      description: description,
      status: 1,
      photo: images[0].base64,
    })
      .then(res => {
        console.log(res);
        if (res?.status === 200) {
          Alert.alert(
            'Sukses',
            'Berhasil membuat Pengaduan Layanan Masyarakat',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
                style: 'default',
              },
            ],
          );
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
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

  return (
    <BaseContainer>
      <Toolbar
        text="Pengaduan Layanan Masyarakat"
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
              value={userData.full_name}
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
              value={userData.email}
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
              onChangeText={setDescription}
            />
          </View>
        </View>
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
            isLoading ? <ActivityIndicator color={WHITE} /> : 'Proses Pengaduan'
          }
          textColor={WHITE}
          containerStyle={styles.btn}
          onPress={_onReport}
        />
      </View>
    </BaseContainer>
  );
};

export default SOSPublic;

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
    backgroundColor: PRIMARY,
  },
});
