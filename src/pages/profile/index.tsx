import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  BaseContainer,
  Button,
  SelectPrimary,
  Spacer,
  Toolbar,
} from 'components';
import {BLACK, GREY1, GREY2, PRIMARY, RED, WHITE} from 'styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoutesParam} from 'routes/types';
import globalStyles from 'styles/globalStyles';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import * as ImagePicker from 'react-native-image-picker';
import {request, PERMISSIONS} from 'react-native-permissions';
import {jenisKelamin, maritalStates, religion} from 'utils/constants';
import DatePicker from 'react-native-date-picker';
import {percentageHeight, percentageWidth} from 'utils/screen_size';
import {ErrorMessage, Formik} from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import userStore from 'store/userStore';

const ProfileSchema = Yup.object().shape({
  fullName: Yup.string().required('Fullname is required'),
});

export interface IProfile {
  fullName: string;
  imageProfile: string;
}

const Profile = () => {
  const navigation =
    useNavigation<StackNavigationProp<RoutesParam, 'Profile'>>();
  const {userData, _getUserData, isUpdateError, _updateUserData} = userStore();
  const [imageProfile, setImageProfile] = useState<ImagePicker.Asset[]>([]);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    _getUserData();
  }, []);

  // useEffect(() => {
  //   if (isUpdateError) {
  //     if (isEdit) {
  //       setImageProfile([...imageProfile, {uri: userData.photo}]);
  //     } else {
  //       setImageProfile([]);
  //     }
  //   }
  // }, [isUpdateError]);

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

      const mergedArray = [...imageProfile, ...resultArr!];
      setImageProfile(mergedArray);
      // _onUploadImage(mergedArray);

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

    const mergedArray = [...imageProfile, ...resultArr!];
    // _onUploadImage(mergedArray);
    setImageProfile(mergedArray);
  };

  const _onUpdateProfile = async (values: {fullName?: string}) => {
    console.log(values);
    if (imageProfile.length >= 0) {
      _updateUserData(values?.fullName, imageProfile[0]?.base64);
    } else {
      _updateUserData(values?.fullName);
    }
  };

  return (
    <BaseContainer>
      <Toolbar
        text="Profile"
        textStyle={{color: WHITE}}
        containerStyle={{backgroundColor: PRIMARY}}
        prefix={
          <Ionicons
            name="chevron-back"
            color={WHITE}
            size={24}
            onPress={() => navigation.goBack()}
          />
        }
      />
      <View
        style={[
          globalStyles.horizontalDefaultPadding,
          globalStyles.verticalDefaultPadding,
        ]}>
        <Formik
          initialValues={{
            fullName: userData?.full_name,
          }}
          validationSchema={ProfileSchema}
          onSubmit={_onUpdateProfile}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <View style={[globalStyles.row]}>
                <Pressable
                  onPress={() => {
                    if (isEdit) {
                      actionSheetRef.current?.show();
                    }
                  }}
                  style={[
                    globalStyles.justifyCenter,
                    globalStyles.alignCenter,
                    {
                      borderRadius: 10,
                      backgroundColor: GREY1,
                      width: 150,
                      height: 150,
                      overflow: 'hidden',
                    },
                  ]}>
                  {imageProfile.length === 0 && isEdit ? (
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
                      source={
                        userData?.photo === null ||
                        userData?.photo === '' ||
                        userData?.photo === undefined
                          ? require('assets/images/logo.png')
                          : isEdit
                          ? {uri: imageProfile[0]?.uri}
                          : {uri: userData?.photo}
                      }
                      style={{
                        width: 150,
                        height: 150,
                        resizeMode: 'stretch',
                      }}
                    />
                  )}
                </Pressable>
                <Spacer width={15} />
                <View style={[globalStyles.displayFlex]}>
                  <Text style={globalStyles.headingBold.h3}>Nama Anda</Text>
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
                    <View style={[globalStyles.displayFlex]}>
                      <TextInput
                        placeholder="Nama Lengkap"
                        placeholderTextColor={GREY2}
                        value={values.fullName}
                        onChangeText={handleChange('fullName')}
                        onBlur={handleBlur('fullName')}
                        editable={isEdit}
                      />
                    </View>
                  </View>
                  {errors.fullName && touched.fullName && isEdit ? (
                    <Text
                      style={[globalStyles.headingRegular.h3, {color: RED}]}>
                      <ErrorMessage name="fullName" />
                    </Text>
                  ) : null}
                </View>
              </View>
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
                    <Text style={[globalStyles.headingRegular.h3]}>Kamera</Text>
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
                text={isEdit ? 'Simpan' : 'Edit'}
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
                  if (isEdit) {
                    handleSubmit();
                  }
                  // isEdit ?  : _onUpdateProfile();
                  setIsEdit(!isEdit);
                }}
                // onPress={() => Alert.alert('CUk')}
              />
            </>
          )}
        </Formik>
      </View>
    </BaseContainer>
  );
};

export default Profile;

const styles = StyleSheet.create({});
