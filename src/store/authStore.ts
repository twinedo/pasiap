import {API_MAIN} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import zustandStorage from 'services/storage';
import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';
import jwt_decode, {JwtPayload} from 'jwt-decode';
import {Alert} from 'react-native';

import userStore from './userStore';
import {fetchAPI} from 'services/fetch';
import {IRegister} from 'pages/register';
import messaging from '@react-native-firebase/messaging';

interface IAuthState {
  user_id: number;
  token: string;
  // id_token: string;
  expires_in: number;
  role: 'user' | 'admin' | 'satpol_pp' | 'linmas' | 'petugas';
  // token_type: string;
}

interface IAuthStore {
  isLoading?: boolean;
  isLoggedIn?: boolean;
  _onLogin: (data: {username: string; password: string}) => void;
  _onLogout: () => void;
  _onCheckExpired: () => void;
  _onRegister: (
    data: IRegister,
    imageKTP: string,
    imageProfile: string,
  ) => void;
  loginData?: IAuthState;
  isError?: boolean;
  errorMessage?: string;
  isRegisterLoading?: boolean;
}

const initState: IAuthState = {
  user_id: 0,
  token: '',
  expires_in: 0,
  // id_token: '',
  role: 'user',
  // token_type: '',
};

const authStore = create<IAuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        isLoading: false,
        isError: false,
        isRegisterLoading: false,
        _onLogin: async data => {
          // set({isLoading: true});
          try {
            set({isLoading: true});
            const response = await fetchAPI({
              url: `${API_MAIN}/login`,
              method: 'post',
              data,
            });
            console.log('res login', response);
            if (response?.status === 200) {
              await messaging().registerDeviceForRemoteMessages();
              const fcmToken = await messaging().getToken();
              console.log('fcmToken', fcmToken);
              if (fcmToken) {
                // alert('test');
                userStore.getState()._onUpdateFCMToken(fcmToken);

                const token = response?.data?.token;
                const decoded: JwtPayload & {
                  role: 'user' | 'admin' | 'satpol_pp' | 'linmas' | 'officer';
                  sub: number;
                  expires_in: number;
                } = jwt_decode(token);
                console.log('Decoded payload:', decoded);
                await AsyncStorage.setItem(
                  '@pasiap_access_token',
                  response?.data?.token,
                );
                await AsyncStorage.setItem(
                  '@pasiap_user_id',
                  decoded.sub?.toString(),
                );
                userStore.getState()._getUserData();
                set({
                  isLoading: false,
                  loginData: {
                    token: token,
                    user_id: decoded?.sub,
                    role: decoded?.role!,
                    expires_in: decoded?.exp!,
                  },
                  isLoggedIn: true,
                });
              }
            } else {
              set({isLoading: false});
            }
          } catch (error: any) {
            console.error('error login', error);
            Alert.alert('Gagal', error?.data?.message?.toString());
            set({
              isLoading: false,
              isLoggedIn: false,
              isError: true,
              errorMessage: error.toString(),
            });
          } finally {
            set({isLoading: false});
          }
        },
        _onLogout: () => {
          messaging().onTokenRefresh(token => {
            console.log('logouttoken', token);
          });
          AsyncStorage.removeItem('@pasiap_access_token');
          // setInterceptor(false);
          // axios.interceptors.request.eject(requestInterceptor);
          userStore.getState()._onResetUser();
          set(() => ({
            isLoading: false,
            isLoggedIn: false,
            loginData: initState,
          }));
        },
        _onCheckExpired: async () => {
          set({isLoading: true});
          const token = get().loginData?.token!;
          var decoded: JwtPayload = jwt_decode(token);
          var exp = decoded.exp;
          var now = new Date().getTime() / 1000;
          if (exp < now) {
            const refreshResponse = await fetchAPI({
              url: `${API_MAIN}/refresh`,
              method: 'post',
              data: {
                token,
              },
            });
            console.log('reffresh res', refreshResponse);
            if (refreshResponse?.status === 200) {
              const token = refreshResponse?.data?.token;
              const decoded: JwtPayload & {
                role: 'user' | 'admin' | 'satpol_pp' | 'linmas' | 'officer';
                sub: number;
                expires_in: number;
              } = jwt_decode(token);
              console.log('Decoded payload:', decoded);
              await AsyncStorage.setItem(
                '@pasiap_access_token',
                refreshResponse?.data?.token,
              );
              await AsyncStorage.setItem(
                '@pasiap_user_id',
                decoded.sub?.toString(),
              );

              set({
                isLoading: false,
                loginData: {
                  token: token,
                  user_id: decoded?.sub,
                  role: decoded?.role!,
                  expires_in: decoded?.exp!,
                },
                isLoggedIn: true,
              });
            } else {
              set({isLoading: false, isLoggedIn: true});
              setTimeout(() => {
                userStore.getState()._getUserData();
              }, 500);
            }
          } else {
            set({isLoading: false, isLoggedIn: true});
            setTimeout(() => {
              userStore.getState()._getUserData();
            }, 500);
          }
        },
        _onRegister: async (
          values: IRegister,
          imageKTP: string,
          imageProfile: string,
        ) => {
          try {
            set({isRegisterLoading: true});
            const response = await fetchAPI({
              url: `${API_MAIN}/register`,
              method: 'post',
              data: {
                name: values.fullName,
                username: values.username,
                email: values.email,
                password: values.password,
                password_confirmation: values.passwordConf,
                phone: values.phone,
                sid: values.nik,
                birth_place: values.placeBirth,
                birth_date: values.birthDate,
                sex: values.gender,
                religion: values.religion,
                marital_status: values.relationships,
                identity_card_photo: imageKTP,
                photo: imageProfile,
              },
            });
            console.log('response regis', response);
            if (response?.status === 201) {
              Alert.alert(
                'Berhasil',
                'Anda berhasil mendaftar Akun. Silahkan cek email untuk verifikasi akun',
              );
            }
            if (response === undefined) {
              Alert.alert('Gagal', 'Silahkan cek form kembali');
            }
          } catch (error) {
            console.error('error', error);
            Alert.alert(
              'Gagal, status: ' + error?.status ?? 500,
              error?.data?.message ?? '',
            );
          } finally {
            set({isRegisterLoading: false});
          }
        },
      }),
      {
        name: '@authState-pasiap',
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);

export default authStore;
