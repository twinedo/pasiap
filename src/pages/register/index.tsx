import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, {useRef, useState} from 'react';
import globalStyles from 'styles/globalStyles';
import {BaseContainer, Button, SelectPrimary, Spacer} from 'components';
import {BLACK, GREY1, GREY2, PRIMARY, RED, WHITE} from 'styles/colors';
import {percentageHeight, percentageWidth} from 'utils/screen_size';
import {ErrorMessage, Formik} from 'formik';
import * as Yup from 'yup';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoutesParam} from 'routes/types';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import * as ImagePicker from 'react-native-image-picker';
import {request, PERMISSIONS} from 'react-native-permissions';
import {jenisKelamin, maritalStates, religion} from 'utils/constants';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import authStore from 'store/authStore';
import InputList, {IFormType} from 'components/input-list';

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required('Username is Required'),
  password: Yup.string().required('Password is required'),
  passwordConf: Yup.string()
    .equals([Yup.ref('password')], 'Password tidak sama')
    .required('Confirmation Password is required'),
  email: Yup.string().email('Email tidak valid').required('Email harus diisi'),
  nik: Yup.string()
    .required('NIK is required')
    .min(16, 'NIK must be 16 characters long')
    .max(16, 'NIK must be 16 characters long'),
  fullName: Yup.string().required('Fullname is required'),
  placeBirth: Yup.string().required('PlaceBirth is required'),
  birthDate: Yup.string().required('BirthDate is required'),
  gender: Yup.string().required('Gender is required'),
  religion: Yup.string().required('Religion is required'),
  relationships: Yup.string().required('Relationships is required'),
  phone: Yup.string().required('Phone is required').min(9, 'Phone tidak cocok'),
});

export interface IRegister {
  username: string;
  password: string;
  passwordConf: string;
  email: string;
  nik: string;
  fullName: string;
  placeBirth: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  religion: string;
  relationships: 'Single' | 'Menikah' | 'Cerai';
  phone: string;
  imageKTP: string;
  imageProfile: string;
}

const Register = () => {
  const navigation =
    useNavigation<StackNavigationProp<RoutesParam, 'Register'>>();
  const [imageKTP, setImageKTP] = useState<ImagePicker.Asset[]>([]);
  const [imageProfile, setImageProfile] = useState<ImagePicker.Asset[]>([]);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [imageParam, setImageParam] = useState<'ktp' | 'profile'>('ktp');

  const {_onRegister, isRegisterLoading} = authStore();

  const [formList] = useState<IFormType[]>([
    {
      id: '1',
      title: null,
      placeholder: 'Username',
      name: 'username',
      type: 'default',
      inputType: 'text',
      options: [],
      prefix: <Ionicons name="person" size={24} color={GREY2} />,
    },
    {
      id: '2',
      title: null,
      placeholder: 'Password',
      name: 'password',
      type: 'default',
      inputType: 'password',
      options: [],
      secureTextEntry: false,
      prefix: <Foundation name="key" size={24} color={GREY2} />,
    },
    {
      id: '3',
      title: null,
      placeholder: 'Password Confirmation',
      name: 'passwordConf',
      type: 'default',
      inputType: 'password',
      options: [],
      secureTextEntry: false,
      prefix: <Foundation name="key" size={24} color={GREY2} />,
    },
    {
      id: '4',
      title: null,
      placeholder: 'Email',
      name: 'email',
      type: 'default',
      inputType: 'text',
      options: [],
      prefix: <Ionicons name="mail" size={24} color={GREY2} />,
    },
    {
      id: '5',
      title: null,
      placeholder: 'Nomor Induk Kependudukan',
      name: 'nik',
      type: 'number-pad',
      inputType: 'text',
      options: [],
      prefix: (
        <MaterialCommunityIcons
          name="card-account-details"
          size={24}
          color={GREY2}
        />
      ),
    },
    {
      id: '6',
      title: null,
      placeholder: 'Nama Lengkap',
      name: 'fullName',
      type: 'default',
      inputType: 'text',
      options: [],
      prefix: <Ionicons name="person-outline" size={24} color={GREY2} />,
    },
    {
      id: '7',
      title: null,
      placeholder: 'Tempat Lahir',
      name: 'placeBirth',
      type: 'default',
      inputType: 'text',
      options: [],
      prefix: <Entypo name="location" size={24} color={GREY2} />,
    },
    {
      id: '8',
      title: null,
      placeholder: 'Tanggal Lahir',
      name: 'birthDate',
      type: 'default',
      inputType: 'date',
      options: [],
      prefix: <Ionicons name="calendar-outline" size={24} color={GREY2} />,
    },
    {
      id: '9',
      title: null,
      placeholder: 'Jenis Kelamin',
      name: 'gender',
      type: 'default',
      inputType: 'select',
      options: jenisKelamin.map(o => o.gender),
      prefix: <Ionicons name="people-outline" size={24} color={GREY2} />,
    },
    {
      id: '10',
      title: null,
      placeholder: 'Agama',
      name: 'religion',
      type: 'default',
      inputType: 'select',
      options: religion,
      selectDropdownTextKey: 'religion',
      selectDropdownValueKey: 'id',
      prefix: (
        <MaterialCommunityIcons name="hands-pray" size={24} color={GREY2} />
      ),
    },
    {
      id: '11',
      title: null,
      placeholder: 'Status Perkawinan',
      name: 'relationships',
      type: 'default',
      inputType: 'select',
      options: maritalStates.map(o => o.value),
      prefix: <Ionicons name="people-circle-sharp" size={24} color={GREY2} />,
    },
    {
      id: '12',
      title: null,
      placeholder: 'Nomor Telepon',
      name: 'phone',
      type: 'default',
      inputType: 'text',
      options: [],
      prefix: <MaterialIcons name="phone-in-talk" size={24} color={GREY2} />,
    },
  ]);

  const _onCameraPress = async () => {
    request(PERMISSIONS.ANDROID.CAMERA).then(async () => {
      const result = await ImagePicker.launchCamera({
        mediaType: 'photo',
        maxWidth: percentageWidth(100),
        maxHeight: 250,
        includeBase64: true,
      });
      console.log('result cam', result);
      actionSheetRef.current?.hide();
      const resultArr = result.assets;
      if (imageParam === 'ktp') {
        const mergedArray = [...imageKTP, ...resultArr!];
        setImageKTP(mergedArray);
      } else {
        const mergedArray = [...imageProfile, ...resultArr!];
        setImageProfile(mergedArray);
      }
      // …
    });
  };

  const _onGalleryPress = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      maxWidth: percentageWidth(100),
      maxHeight: 250,
      includeBase64: true,
    });
    console.log('result gallery', result.assets);
    actionSheetRef.current?.hide();
    const resultArr = result.assets;
    if (imageParam === 'ktp') {
      const mergedArray = [...imageKTP, ...resultArr!];
      setImageKTP(mergedArray);
    } else {
      const mergedArray = [...imageProfile, ...resultArr!];
      setImageProfile(mergedArray);
    }
  };

  console.log('imagesKTP', imageKTP);
  console.log('imageProfile', imageProfile);

  // const _onSubmitRegister = async (
  //   values: IRegister & {identity_card_photo: string; photo: string},
  // ) => {
  //   if (values.passwordConf !== values.password) {
  //     Alert.alert('Error', 'Password dan Password confirmation harus sama');
  //   } else if (imageKTP.length === 0 || imageProfile.length === 0) {
  //     Alert.alert('Error', 'Silahkan masukkan Foto pada kolom yang tersedia');
  //   } else {
  //     _onRegister(values, imageKTP[0]?.base64!, imageProfile[0]?.base64!);
  //   }
  // };

  return (
    <BaseContainer scrollable>
      <StatusBar backgroundColor={WHITE} barStyle="dark-content" />
      <View style={[globalStyles.displayFlex, {backgroundColor: PRIMARY}]}>
        <View
          style={[
            globalStyles.justifyCenter,
            globalStyles.alignCenter,
            {
              height: percentageHeight(50),
              //   position: 'absolute',
              backgroundColor: WHITE,
              borderBottomLeftRadius: 50,
              borderBottomRightRadius: 50,
            },
          ]}
        />
        <View
          style={[
            {
              //   position: 'absolute',
              top: -percentageHeight(40),
              width: percentageWidth(80),
              backgroundColor: WHITE,
              borderWidth: 1,
              borderRadius: 10,
              alignSelf: 'center',
            },
            globalStyles.horizontalDefaultPadding,
            globalStyles.verticalDefaultPadding,
          ]}>
          {/* <ScrollView> */}
          <Text
            style={[
              globalStyles.headingBlack.h3,
              globalStyles.textAlignCenter,
            ]}>
            Daftar
          </Text>
          <Spacer height={20} />
          <Text
            style={[
              globalStyles.headingRegular.h3,
              globalStyles.textAlignCenter,
              {color: GREY2},
            ]}>
            Silahkan Masukkan Data Diri untuk Daftar
          </Text>
          <Spacer height={20} />
          <InputList
            form={formList}
            initialValues={{
              username: '',
              password: '',
              passwordConf: '',
              email: '',
              nik: '',
              fullName: '',
              placeBirth: '',
              birthDate: '',
              gender: 'Laki-laki',
              religion: '',
              relationships: 'Menikah',
              phone: '',
            }}
            validationSchema={RegisterSchema}
            onSubmit={values => {
              console.log('val', values);
              _onRegister(
                values,
                imageKTP[0]?.base64!,
                imageProfile[0]?.base64!,
              );
            }}
            ListFooterComponent={
              <>
                <Pressable
                  onPress={() => {
                    actionSheetRef.current?.show();
                    setImageParam('ktp');
                  }}
                  style={[
                    globalStyles.justifyCenter,
                    globalStyles.alignCenter,
                    {
                      borderRadius: 10,
                      backgroundColor: GREY1,
                      width: '100%',
                      height: 150,
                      overflow: 'hidden',
                    },
                  ]}>
                  {imageKTP.length === 0 ? (
                    <>
                      <MaterialIcons
                        name="add-a-photo"
                        size={50}
                        color={WHITE}
                      />
                      <Text
                        style={[globalStyles.headingBold.h3, {color: WHITE}]}>
                        Foto KTP
                      </Text>
                    </>
                  ) : (
                    <Image
                      //   source={require('assets/images/logo.png')}
                      source={{uri: imageKTP[imageKTP.length - 1].uri}}
                      style={{
                        width: '100%',
                        height: 150,
                        resizeMode: 'stretch',
                      }}
                    />
                  )}
                </Pressable>
                <Text style={[globalStyles.bodyBlack.h3, {color: BLACK}]}>
                  *Max size (3mb)
                </Text>
                <Spacer height={20} />
                <Pressable
                  onPress={() => {
                    actionSheetRef.current?.show();
                    setImageParam('profile');
                  }}
                  style={[
                    globalStyles.justifyCenter,
                    globalStyles.alignCenter,
                    {
                      borderRadius: 10,
                      backgroundColor: GREY1,
                      width: '100%',
                      height: 150,
                      overflow: 'hidden',
                    },
                  ]}>
                  {imageProfile.length === 0 ? (
                    <>
                      <MaterialIcons
                        name="add-a-photo"
                        size={50}
                        color={WHITE}
                      />
                      <Text
                        style={[globalStyles.headingBold.h3, {color: WHITE}]}>
                        Foto Profile
                      </Text>
                    </>
                  ) : (
                    <Image
                      //   source={require('assets/images/logo.png')}
                      source={{uri: imageProfile[imageProfile.length - 1].uri}}
                      style={{
                        width: '100%',
                        height: 150,
                        resizeMode: 'stretch',
                      }}
                    />
                  )}
                </Pressable>
                <Text style={[globalStyles.bodyBlack.h3, {color: BLACK}]}>
                  *Max size (3mb)
                </Text>
                <Spacer height={30} />
              </>
            }
            submitComponent={handleSubmit => (
              <>
                <Button
                  text={
                    isRegisterLoading ? (
                      <ActivityIndicator color={WHITE} />
                    ) : (
                      'REGISTER'
                    )
                  }
                  textColor={WHITE}
                  containerStyle={{
                    backgroundColor: PRIMARY,
                    width: '100%',
                    height: 40,
                    borderRadius: 5,
                  }}
                  // disabled={!isValid}
                  // onPress={() => navigation.navigate('NavMainMenu')}
                  onPress={() => {
                    handleSubmit();
                    // Alert.alert('Please');
                  }}
                  // onPress={() => Alert.alert('CUk')}
                />
                <Spacer height={30} />
                <Button
                  text="LOGIN"
                  textColor={PRIMARY}
                  containerStyle={{
                    borderWidth: 2,
                    borderColor: PRIMARY,
                    width: '100%',
                    height: 40,
                    borderRadius: 5,
                  }}
                  onPress={() => navigation.goBack()}
                />
                <Spacer height={20} />
              </>
            )}
          />
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
        </View>
      </View>
    </BaseContainer>
  );
};

export default Register;

const styles = StyleSheet.create({});
