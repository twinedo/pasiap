import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {BaseContainer, Button, Spacer} from 'components';
import globalStyles from 'styles/globalStyles';
import {BLACK, GREY1, GREY2, PRIMARY, RED, WHITE} from 'styles/colors';
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
import InputList, {IFormType} from 'components/input-list';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Email Address is Required'),
  password: Yup.string().required('Password is required'),
});

export type TLoginField = {
  username: string;
  password: string;
};

const Login = () => {
  const navigation = useNavigation<StackNavigationProp<RoutesParam, 'Login'>>();
  const {_onLogin, isLoading, loginData} = authStore();
  console.log('looginData', loginData);

  const [formList, setFormList] = useState<IFormType[]>([
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
  ]);

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

          <InputList
            form={formList}
            initialValues={{username: '', password: ''}}
            validationSchema={LoginSchema}
            onSubmit={values => {
              console.log('val', values);
              _onLogin({
                username: values.username,
                password: values.password,
              });
            }}
            ListFooterComponent={
              <View style={[globalStyles.alignEnd]}>
                <Text
                  onPress={() => navigation.navigate('ForgotPassword')}
                  style={[globalStyles.headingRegular.h3, {color: GREY2}]}>
                  Lupa Password ?
                </Text>
              </View>
            }
            submitComponent={handleSubmit => (
              <>
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
          />
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
