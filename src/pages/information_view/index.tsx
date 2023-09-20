import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React from 'react';
import {BaseContainer, Toolbar, Spacer} from 'components';
import ActionSheet from 'react-native-actions-sheet';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  WHITE,
  PRIMARY,
  GREY2,
  GREY1,
  BLUE,
  BLACK,
  SOFTGREEN,
} from 'styles/colors';
import globalStyles from 'styles/globalStyles';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RoutesParam} from 'routes/types';
import moment from 'moment';
import {DEFAULT_ARTICLE_STORAGE} from '@env';

const InformationView = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RoutesParam, 'InformationView'>>();
  const params = route.params;
  const data = params.data;
  return (
    <BaseContainer>
      <Toolbar
        text="Informasi"
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
          <Text style={[globalStyles.headingBlack.h1]}>{data.title}</Text>
          {data.cover !== DEFAULT_ARTICLE_STORAGE ? (
            <Image
              source={{uri: data.cover}}
              style={{width: 'auto', height: 300, borderRadius: 8}}
            />
          ) : null}
          <Spacer height={15} />

          <View
            style={[
              globalStyles.row,
              globalStyles.alignCenter,
              {columnGap: 12},
            ]}>
            <Text
              style={[
                globalStyles.headingRegular.h3,
                {
                  color: BLACK,
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: SOFTGREEN,
                },
              ]}>
              {data?.category}
            </Text>
            <Text style={[globalStyles.headingRegular.h3, {color: GREY1}]}>
              {moment(data?.created_at).format('DD MMMM YYYY')}
            </Text>
          </View>
          <Spacer height={15} />
          <Text
            style={[globalStyles.headingRegular.h3, {textAlign: 'justify'}]}>
            {data.description}
          </Text>
        </View>
      </ScrollView>
    </BaseContainer>
  );
};

export default InformationView;

const styles = StyleSheet.create({});
