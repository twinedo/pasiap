import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React from 'react';
import {BaseContainer, Button, Spacer} from 'components';
import globalStyles from 'styles/globalStyles';
import {GREY1, GREY2, PRIMARY, RED, WHITE} from 'styles/colors';
import {percentageHeight, percentageWidth} from 'utils/screen_size';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import {useNavigation} from '@react-navigation/native';
import {Formik, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoutesParam} from 'routes/types';
import authStore from 'store/authStore';
import {ActivityIndicator} from 'react-native';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Email Address is Required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigation = useNavigation<StackNavigationProp<RoutesParam, 'Login'>>();
  const {_onLogin, isLoading, loginData} = authStore();
  console.log('looginData', loginData);
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
              // position: 'absolute',
              backgroundColor: WHITE,
              borderBottomLeftRadius: 50,
              borderBottomRightRadius: 50,
            },
          ]}>
          <Image
            source={require('assets/images/logo.png')}
            style={{width: 150, height: 200, resizeMode: 'contain'}}
          />
          <Spacer height={20} />
          <Text style={[globalStyles.headingBold.h3, {color: PRIMARY}]}>
            PASIAP | PALUTA SIGAP
          </Text>
        </View>
        <View
          style={[
            {
              position: 'relative',
              top: -30,
              width: percentageWidth(80),
              backgroundColor: WHITE,
              borderWidth: 1,
              borderRadius: 10,
              alignSelf: 'center',
            },
            globalStyles.horizontalDefaultPadding,
            globalStyles.verticalDefaultPadding,
          ]}>
          <Text
            style={[
              globalStyles.headingBlack.h3,
              globalStyles.textAlignCenter,
            ]}>
            Login
          </Text>
          <Spacer height={10} />
          <Text
            style={[
              globalStyles.headingRegular.h3,
              globalStyles.textAlignCenter,
              {color: GREY2},
            ]}>
            Silahkan Masukkan Akun anda untuk Login
          </Text>
          <Spacer height={10} />
          <Formik
            initialValues={{username: '', password: ''}}
            validationSchema={LoginSchema}
            onSubmit={async values => {
              console.log(values);
              _onLogin({
                username: values.username,
                password: values.password,
              });
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
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
                <Button
                  text={
                    isLoading ? <ActivityIndicator color={WHITE} /> : 'LOGIN'
                  }
                  textColor={WHITE}
                  containerStyle={{
                    backgroundColor: PRIMARY,
                    width: '100%',
                    height: 40,
                    borderRadius: 5,
                  }}
                  // onPress={() => navigation.navigate('NavMainMenu')}
                  onPress={handleSubmit}
                  // onPress={() => Alert.alert('CUk')}
                />
                <Spacer height={20} />
                <Button
                  text="DAFTAR"
                  textColor={PRIMARY}
                  containerStyle={{
                    borderWidth: 1,
                    borderColor: PRIMARY,
                    width: '100%',
                    height: 40,
                    borderRadius: 5,
                  }}
                  onPress={() => navigation.navigate('Register')}
                />
              </>
            )}
          </Formik>
          {/* <Text style={[globalStyles.headingBold.h2, {color: PRIMARY}]}>
            developed by: twinedo
          </Text> */}
        </View>
      </View>
    </BaseContainer>
  );
};

export default Login;

const styles = StyleSheet.create({});
