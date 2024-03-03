import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {BaseContainer, Button, Spacer, Toolbar} from 'components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BLACK, GREY2, PRIMARY, WHITE} from 'styles/colors';
import globalStyles from 'styles/globalStyles';
import InputList, {IFormType} from 'components/input-list';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoutesParam} from 'routes/types';
import {ResetPassword} from 'services/handler';

const ForgotSchema = Yup.object().shape({
  email: Yup.string().required('Email Address is Required'),
});

const ForgotPassword = () => {
  const navigation =
    useNavigation<StackNavigationProp<RoutesParam, 'ForgotPassword'>>();

  const [formList, setFormList] = useState<IFormType[]>([
    {
      id: '1',
      title: null,
      placeholder: 'Email',
      name: 'email',
      type: 'email-address',
      inputType: 'text',
      options: [],
      prefix: <Ionicons name="mail" size={24} color={GREY2} />,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const _onResetPass = (values: {email: string}) => {
    setIsLoading(true);
    console.log('val', values);
    ResetPassword(values.email)
      .then(res => {
        console.log('resss', res);
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Gagal', err?.data?.message?.toString());
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <BaseContainer>
      <Toolbar
        prefix={
          <Ionicons
            name="chevron-back"
            size={24}
            color={BLACK}
            onPress={() => navigation.goBack()}
          />
        }
        text="Lupa Password"
      />
      <View
        style={[
          globalStyles.displayFlex,
          globalStyles.verticalDefaultPadding,
          globalStyles.horizontalDefaultPadding,
        ]}>
        <InputList
          form={formList}
          initialValues={{email: ''}}
          validationSchema={ForgotSchema}
          onSubmit={_onResetPass}
          submitComponent={handleSubmit => (
            <>
              <Spacer height={20} />
              <Button
                text={isLoading ? <ActivityIndicator color={WHITE} /> : 'RESET'}
                textColor={WHITE}
                containerStyle={{
                  backgroundColor: PRIMARY,
                  width: '100%',
                  height: 40,
                  borderRadius: 5,
                }}
                onPress={handleSubmit}
              />
            </>
          )}
        />
      </View>
    </BaseContainer>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({});
