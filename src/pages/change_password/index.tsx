import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {BaseContainer, Button, Spacer, Toolbar} from 'components';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoutesParam} from 'routes/types';
import {GREY1, GREY2, PRIMARY, RED, WHITE} from 'styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ErrorMessage, Formik} from 'formik';
import * as Yup from 'yup';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import globalStyles from 'styles/globalStyles';
import {UpdatePassword} from 'services/handler';

const PasswordSchema = Yup.object().shape({
  password: Yup.string().required('Password is required'),
  password_confirmation: Yup.string().required(
    'Password Confirmation is required',
  ),
});

const ChangePassword = () => {
  const navigation =
    useNavigation<StackNavigationProp<RoutesParam, 'ChangePassword'>>();
  const [isLoading, setIsLoading] = useState(false);

  const _onUpdatePassword = (values: {
    password: string;
    password_confirmation: string;
  }) => {
    setIsLoading(true);
    UpdatePassword(values.password, values.password_confirmation)
      .then(res => {
        console.log('reset password', res);
        if (res?.status === 200) {
          Alert.alert('Success', 'Password has been changed successfully');
        }
      })
      .catch(err => {
        if (err.status === 400) {
          Alert.alert(
            'Failed to change password',
            err?.data?.message?.password[0],
          );
        } else if (err.status === 500) {
          Alert.alert('Failed to change password', err?.data?.message);
        }
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <BaseContainer>
      <Toolbar
        text="Change Password"
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
          globalStyles.displayFlex,
          globalStyles.horizontalDefaultPadding,
          globalStyles.verticalDefaultPadding,
        ]}>
        <Formik
          initialValues={{
            password: '',
            password_confirmation: '',
          }}
          validationSchema={PasswordSchema}
          onSubmit={values => _onUpdatePassword(values)}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <Text style={globalStyles.headingBold.h3}>Password</Text>
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
                <Ionicons name="lock-closed" size={24} color={GREY2} />
                <Spacer width={10} />
                <View style={[globalStyles.displayFlex]}>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor={GREY2}
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    secureTextEntry
                  />
                </View>
              </View>
              {errors.password && touched.password ? (
                <Text style={[globalStyles.headingRegular.h3, {color: RED}]}>
                  <ErrorMessage name="password" />
                </Text>
              ) : null}

              <Spacer height={15} />

              <Text style={globalStyles.headingBold.h3}>
                Password Confirmation
              </Text>
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
                <Ionicons name="lock-closed" size={24} color={GREY2} />
                <Spacer width={10} />
                <View style={[globalStyles.displayFlex]}>
                  <TextInput
                    placeholder="Password Confirmation"
                    placeholderTextColor={GREY2}
                    value={values.password_confirmation}
                    onChangeText={handleChange('password_confirmation')}
                    onBlur={handleBlur('password_confirmation')}
                    secureTextEntry
                  />
                </View>
              </View>
              {errors.password_confirmation && touched.password_confirmation ? (
                <Text style={[globalStyles.headingRegular.h3, {color: RED}]}>
                  <ErrorMessage name="password_confirmation" />
                </Text>
              ) : null}

              <Spacer height={30} />

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
                      values.password === '' ||
                      values.password_confirmation === ''
                        ? GREY1
                        : PRIMARY,
                  },
                ]}
                onPress={() => handleSubmit()}
                // onPress={() => Alert.alert('test')}
                disabled={
                  values.password === '' ||
                  values.password_confirmation === '' ||
                  isLoading
                    ? true
                    : false
                }
              />
            </>
          )}
        </Formik>
      </View>
    </BaseContainer>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  btn: {
    borderRadius: 10,
    height: 50,
    width: '100%',
  },
});
