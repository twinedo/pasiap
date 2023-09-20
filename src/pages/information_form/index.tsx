import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {BaseContainer, Button, Spacer, Toolbar} from 'components';
import {BLACK, GREY1, GREY2, PRIMARY, WHITE, BLUE} from 'styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import globalStyles from 'styles/globalStyles';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoutesParam} from 'routes/types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {PERMISSIONS, request} from 'react-native-permissions';
import * as ImagePicker from 'react-native-image-picker';
import {percentageWidth} from 'utils/screen_size';
import {PostInformation, UpdateInformation} from 'services/handler';
import {IInformation} from 'store/informationStore';

const InformationForm = () => {
  const navigation =
    useNavigation<StackNavigationProp<RoutesParam, 'InformationForm'>>();
  const route = useRoute<RouteProp<RoutesParam, 'InformationForm'>>();
  console.log('route', route);
  const params = route.params;
  console.log('params', params);
  const data = params?.data;

  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [images, setImages] = useState<ImagePicker.Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<IInformation>({
    title: data?.title ?? '',
    description: data?.description ?? '',
    category: data?.category ?? 'umum',
    is_publish: data?.is_publish ?? true,
  });

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
      const mergedArray = [...images, ...resultArr!];
      setImages(mergedArray);
      setForm({...form, cover: mergedArray[0].base64});
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
        includeBase64: true,
      });
      console.log('result gallery', result.assets);
      actionSheetRef.current?.hide();
      const resultArr = result.assets;
      const mergedArray = [...images, ...resultArr!];
      // _onUploadImage(mergedArray);
      setImages(mergedArray);
      setForm({...form, cover: mergedArray[0].base64});
    });
  };

  const _onPostInfo = () => {
    setIsLoading(true);

    if (params?.params === 'update') {
      UpdateInformation(
        {
          title: form.title,
          description: form.description,
          cover: form.cover,
          category: form.category,
          is_publish: true,
        },
        data?.id!,
      )
        .then(res => {
          console.log(res);
          if (res?.status === 200) {
            Alert.alert('Sukses', 'Berhasil mengedit Informasi', [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
                style: 'default',
              },
            ]);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => setIsLoading(false));
    } else {
      PostInformation({
        title: form.title,
        description: form.description,
        cover: form.cover,
        category: form.category,
        is_publish: true,
      })
        .then(res => {
          console.log(res);
          if (res?.status === 200) {
            Alert.alert('Sukses', 'Berhasil membuat Informasi', [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
                style: 'default',
              },
            ]);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => setIsLoading(false));
    }
  };

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
          <Spacer height={15} />
          <Text style={[globalStyles.headingRegular.h3]}>Judul Artikel</Text>

          <View
            style={[
              globalStyles.row,
              globalStyles.alignCenter,
              globalStyles.horizontalDefaultPadding,
              styles.inputContainer,
            ]}>
            <Ionicons name="document-text-outline" size={24} color={GREY2} />
            <Spacer width={10} />
            <View style={globalStyles.displayFlex}>
              <TextInput
                placeholder="Title"
                placeholderTextColor={GREY2}
                value={form.title}
                onChangeText={(text: string) => setForm({...form, title: text})}
              />
            </View>
          </View>
          <Spacer height={15} />
          <Text style={[globalStyles.headingRegular.h3]}>Deskripsi</Text>
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
                value={form.description}
                onChangeText={(text: string) =>
                  setForm({...form, description: text})
                }
              />
            </View>
          </View>

          <Spacer height={15} />
          <View>
            <Text style={[globalStyles.headingRegular.h3]}>Kategori</Text>
            <View
              style={[
                globalStyles.displayFlex,
                globalStyles.row,
                globalStyles.alignCenter,
              ]}>
              <Pressable
                onPress={() => setForm({...form, category: 'khusus'})}
                style={[
                  globalStyles.row,
                  globalStyles.alignCenter,
                  globalStyles.displayFlex,
                  {columnGap: 8},
                ]}>
                <FontAwesome
                  name={
                    form.category === 'khusus' ? 'dot-circle-o' : 'circle-o'
                  }
                  color={form.category === 'khusus' ? BLUE : GREY1}
                  size={24}
                />
                <Text style={[globalStyles.headingSemibold.h3]}>Khusus</Text>
              </Pressable>
              <Pressable
                onPress={() => setForm({...form, category: 'umum'})}
                style={[
                  globalStyles.row,
                  globalStyles.alignCenter,
                  globalStyles.displayFlex,
                  {columnGap: 8},
                ]}>
                <FontAwesome
                  name={form.category === 'umum' ? 'dot-circle-o' : 'circle-o'}
                  color={form.category === 'umum' ? BLUE : GREY1}
                  size={24}
                />
                <Text style={[globalStyles.headingSemibold.h3]}>Umum</Text>
              </Pressable>
            </View>
          </View>
          <Spacer height={15} />

          <Text style={[globalStyles.headingRegular.h3]}>Cover (opsional)</Text>
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
              isLoading ? (
                <ActivityIndicator color={WHITE} />
              ) : (
                'Sebarkan Informasi'
              )
            }
            textColor={WHITE}
            containerStyle={[
              styles.btn,
              {
                backgroundColor:
                  form.title === '' || form.description === ''
                    ? GREY1
                    : PRIMARY,
              },
            ]}
            disabled={
              form.title === '' || form.description === '' ? true : false
            }
            onPress={_onPostInfo}
          />
        </View>
      </ScrollView>
    </BaseContainer>
  );
};

export default InformationForm;

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
