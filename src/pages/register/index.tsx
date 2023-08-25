import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
  Alert,
  StatusBar,
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

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required('Username is Required'),
  password: Yup.string().required('Password is required'),
  passwordConf: Yup.string()
    .equals([Yup.ref('password')], 'Password tidak sama')
    .required('Confirmation Password is required'),
  nik: Yup.string()
    .required('NIK is required')
    .min(16, 'NIK is 16 characters long'),
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
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageParam, setImageParam] = useState<'ktp' | 'profile'>('ktp');

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

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
      if (imageParam === 'ktp') {
        const mergedArray = [...imageKTP, ...resultArr!];
        setImageKTP(mergedArray);
        _onUploadImage(mergedArray);
      } else {
        const mergedArray = [...imageProfile, ...resultArr!];
        setImageProfile(mergedArray);
        _onUploadImage(mergedArray);
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
    });
    console.log('result gallery', result.assets);
    actionSheetRef.current?.hide();
    const resultArr = result.assets;
    if (imageParam === 'ktp') {
      const mergedArray = [...imageKTP, ...resultArr!];
      _onUploadImage(mergedArray);
      setImageKTP(mergedArray);
    } else {
      const mergedArray = [...imageProfile, ...resultArr!];
      _onUploadImage(mergedArray);
      setImageProfile(mergedArray);
    }
  };

  const _onUploadImage = (img: ImagePicker.Asset[]) => {
    setIsImageLoading(true);
  };

  console.log('imagesKTP', imageKTP);
  console.log('imageProfile', imageProfile);

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
          <Formik
            initialValues={{} as IRegister}
            validationSchema={RegisterSchema}
            onSubmit={values => {
              Alert.alert(values.username.toString());
              console.log(values);
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
              isValid,
            }) => (
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
                      placeholder="Username"
                      placeholderTextColor={GREY2}
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      value={values.username}
                    />
                  </View>
                </View>
                {errors.username && touched.username ? (
                  <Text style={[globalStyles.headingRegular.h3, {color: RED}]}>
                    <ErrorMessage name="username" />
                  </Text>
                ) : null}
                <Spacer height={20} />
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
                  <Foundation name="key" size={24} color={GREY2} />
                  <Spacer width={10} />
                  <View style={globalStyles.displayFlex}>
                    <TextInput
                      placeholder="Password"
                      placeholderTextColor={GREY2}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      secureTextEntry
                    />
                  </View>
                </View>
                {errors.password && touched.password ? (
                  <Text style={[globalStyles.headingRegular.h3, {color: RED}]}>
                    <ErrorMessage name="password" />
                  </Text>
                ) : null}
                <Spacer height={20} />
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
                  <Foundation name="key" size={24} color={GREY2} />
                  <Spacer width={10} />
                  <View style={globalStyles.displayFlex}>
                    <TextInput
                      placeholder="Password Confirmation"
                      placeholderTextColor={GREY2}
                      onChangeText={handleChange('passwordConf')}
                      onBlur={handleBlur('passwordConf')}
                      value={values.passwordConf}
                      secureTextEntry
                    />
                  </View>
                </View>
                {errors.passwordConf && touched.passwordConf ? (
                  <Text style={[globalStyles.headingRegular.h3, {color: RED}]}>
                    <ErrorMessage name="passwordConf" />
                  </Text>
                ) : null}

                <Spacer height={20} />
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
                  <MaterialCommunityIcons
                    name="card-account-details"
                    size={24}
                    color={GREY2}
                  />
                  <Spacer width={10} />
                  <View style={globalStyles.displayFlex}>
                    <TextInput
                      placeholder="Nomor Induk Kependudukan"
                      placeholderTextColor={GREY2}
                      onChangeText={handleChange('nik')}
                      onBlur={handleBlur('nik')}
                      value={values.nik}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>
                {errors.nik && touched.nik ? (
                  <Text style={[globalStyles.headingRegular.h3, {color: RED}]}>
                    <ErrorMessage name="nik" />
                  </Text>
                ) : null}
                <Spacer height={20} />
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
                  <Ionicons name="person-outline" size={24} color={GREY2} />
                  <Spacer width={10} />
                  <View style={globalStyles.displayFlex}>
                    <TextInput
                      placeholder="Nama Lengkap"
                      placeholderTextColor={GREY2}
                      onChangeText={handleChange('fullName')}
                      onBlur={handleBlur('fullName')}
                      value={values.fullName}
                    />
                  </View>
                </View>
                {errors.fullName && touched.fullName ? (
                  <Text style={[globalStyles.headingRegular.h3, {color: RED}]}>
                    <ErrorMessage name="fullName" />
                  </Text>
                ) : null}
                <Spacer height={20} />
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
                  <Entypo name="location" size={24} color={GREY2} />
                  <Spacer width={10} />
                  <View style={globalStyles.displayFlex}>
                    <TextInput
                      placeholder="Tempat Lahir"
                      placeholderTextColor={GREY2}
                      onChangeText={handleChange('placeBirth')}
                      onBlur={handleBlur('placeBirth')}
                      value={values.placeBirth}
                    />
                  </View>
                </View>
                {errors.placeBirth && touched.placeBirth ? (
                  <Text style={[globalStyles.headingRegular.h3, {color: RED}]}>
                    <ErrorMessage name="placeBirth" />
                  </Text>
                ) : null}
                <Spacer height={20} />
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
                  <Ionicons name="calendar-outline" size={24} color={GREY2} />
                  <Spacer width={10} />
                  <View style={globalStyles.displayFlex}>
                    <TextInput
                      placeholder="Tanggal Lahir"
                      placeholderTextColor={GREY2}
                      onChangeText={() => {
                        handleChange('birthDate');
                        setOpen(true);
                      }}
                      onFocus={() => setOpen(true)}
                      onPressIn={() => setOpen(true)}
                      onBlur={handleBlur('birthDate')}
                      value={values.birthDate}
                    />
                  </View>
                </View>
                <DatePicker
                  modal
                  open={open}
                  date={date}
                  mode="date"
                  onConfirm={dat => {
                    console.log('inidat', moment(dat).format('DD-MM-YYYY'));
                    setOpen(false);
                    setFieldValue(
                      'birthDate',
                      moment(dat).format('DD-MM-YYYY'),
                    );
                    setDate(dat);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
                {errors.birthDate && touched.birthDate ? (
                  <Text style={[globalStyles.headingRegular.h3, {color: RED}]}>
                    <ErrorMessage name="birthDate" />
                  </Text>
                ) : null}
                <Spacer height={20} />
                {/* <View
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
                  <Ionicons name="people-outline" size={24} color={GREY2} />
                  <Spacer width={10} />
                  <View style={globalStyles.displayFlex}>
                    <TextInput
                      placeholder="Jenis Kelamin"
                      placeholderTextColor={GREY2}
                      onChangeText={handleChange('gender')}
                      onBlur={handleBlur('gender')}
                      value={values.gender}
                    />
                  </View>
                </View> */}
                <SelectPrimary
                  defaultButtonText="Jenis Kelamin"
                  data={jenisKelamin}
                  onSelect={(value: any) => {
                    setFieldValue('gender', value.value);
                    console.log(value);
                  }}
                  keyItem="gender"
                  renderDropdownIcon={() => (
                    <Ionicons name="people-outline" size={24} color={GREY2} />
                  )}
                />
                {errors.gender && touched.gender ? (
                  <Text style={[globalStyles.headingRegular.h3, {color: RED}]}>
                    <ErrorMessage name="gender" />
                  </Text>
                ) : null}
                <Spacer height={20} />
                {/* <View
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
                  <MaterialCommunityIcons
                    name="hands-pray"
                    size={24}
                    color={GREY2}
                  />

                </View> */}
                <SelectPrimary
                  defaultButtonText="Agama"
                  data={religion}
                  onSelect={(value: any) => {
                    setFieldValue('religion', value.value);
                    console.log(value);
                  }}
                  keyItem="religion"
                  renderDropdownIcon={() => (
                    <MaterialCommunityIcons
                      name="hands-pray"
                      size={24}
                      color={GREY2}
                    />
                  )}
                />
                {errors.religion && touched.religion ? (
                  <Text style={[globalStyles.headingRegular.h3, {color: RED}]}>
                    <ErrorMessage name="religion" />
                  </Text>
                ) : null}
                <Spacer height={20} />
                {/* <View
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
                  <Ionicons
                    name="people-circle-sharp"
                    size={24}
                    color={GREY2}
                  />
                  <Spacer width={10} />
                  <View style={globalStyles.displayFlex}>
                    <TextInput
                      placeholder="Status Perkawinan"
                      placeholderTextColor={GREY2}
                      onChangeText={handleChange('relationships')}
                      onBlur={handleBlur('relationships')}
                      value={values.relationships}
                    />
                  </View>
                </View> */}
                <SelectPrimary
                  defaultButtonText="Status Perkawinan"
                  data={maritalStates}
                  onSelect={(value: any) => {
                    setFieldValue('relationships', value.value);
                    console.log(value);
                  }}
                  keyItem="value"
                  renderDropdownIcon={() => (
                    <Ionicons
                      name="people-circle-sharp"
                      size={24}
                      color={GREY2}
                    />
                  )}
                />
                {errors.relationships && touched.relationships ? (
                  <Text style={[globalStyles.headingRegular.h3, {color: RED}]}>
                    <ErrorMessage name="relationships" />
                  </Text>
                ) : null}
                <Spacer height={20} />
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
                  <MaterialIcons name="phone-in-talk" size={32} color={GREY2} />
                  <Spacer width={10} />
                  <View style={globalStyles.displayFlex}>
                    <TextInput
                      placeholder="Nomor Telepon"
                      placeholderTextColor={GREY2}
                      onChangeText={handleChange('phone')}
                      onBlur={handleBlur('phone')}
                      value={values.phone}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
                {errors.phone && touched.phone ? (
                  <Text style={[globalStyles.headingRegular.h3, {color: RED}]}>
                    <ErrorMessage name="phone" />
                  </Text>
                ) : null}
                <Spacer height={20} />
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
                      source={{uri: imageKTP[0].uri}}
                      style={{
                        width: '100%',
                        height: 150,
                        resizeMode: 'stretch',
                      }}
                    />
                  )}
                </Pressable>
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
                      source={{uri: imageProfile[0].uri}}
                      style={{
                        width: '100%',
                        height: 150,
                        resizeMode: 'stretch',
                      }}
                    />
                  )}
                </Pressable>
                <Spacer height={30} />
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
                      <Text style={[globalStyles.headingRegular.h3]}>
                        Kamera
                      </Text>
                    </Pressable>
                    <Spacer width={5} />
                    <Pressable
                      style={[globalStyles.row, globalStyles.alignCenter]}
                      onPress={_onGalleryPress}>
                      <Ionicons name="images" size={50} color={BLACK} />
                      <Spacer width={10} />
                      <Text style={[globalStyles.headingRegular.h3]}>
                        Gallery
                      </Text>
                    </Pressable>
                  </View>
                </ActionSheet>
                <Button
                  text="REGISTER"
                  textColor={WHITE}
                  containerStyle={{
                    backgroundColor: PRIMARY,
                    width: '100%',
                    height: 40,
                    borderRadius: 5,
                  }}
                  // disabled={!isValid}
                  // onPress={() => navigation.navigate('NavMainMenu')}
                  onPress={handleSubmit}
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
          </Formik>
          {/* </ScrollView> */}
        </View>
      </View>
    </BaseContainer>
  );
};

export default Register;

const styles = StyleSheet.create({});
