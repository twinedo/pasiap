import {API_MAIN} from '@env';
import zustandStorage from 'services/storage';
import {useAxios} from 'services/useAxios';
import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';
import {Alert} from 'react-native';

interface IUserData {
  user_id: number;
  full_name: string;
  email: string;
  sid: string;
  birth_place?: any;
  birth_date?: any;
  sex?: any;
  religion_id?: any;
  religion_name?: any;
  marital_status?: any;
  phone: string;
  identity_card_photo: string;
  photo: string;
}

interface IUserStore {
  _getUserData: () => void;
  _updateUserData: (name?: string, photo?: string) => void;
  _onResetUser: () => void;
  _onUpdateFCMToken: (token: string) => void;
  userData: IUserData;
  isLoading: boolean;
  isError?: boolean;
  isUpdateError?: boolean;
  errorMessage?: string;
}

const userStore = create<IUserStore>()(
  devtools(
    persist(
      (set, get) => ({
        isLoading: false,
        isUpdateError: false,
        userData: {
          user_id: 0,
          full_name: '',
          email: '',
          sid: '',
          birth_place: null,
          birth_date: null,
          sex: null,
          religion_id: null,
          religion_name: null,
          marital_status: null,
          phone: '',
          identity_card_photo: '',
          photo: '',
        },
        _getUserData: async () => {
          set({isLoading: true, isError: false, errorMessage: ''});
          try {
            const response = await useAxios({
              url: `${API_MAIN}/profiles`,
              method: 'get',
            });
            console.log('resUserData', response);
            set({isLoading: false, userData: response?.data?.data});
          } catch (error) {
            set({
              isLoading: false,
              isError: true,
              errorMessage: error?.toString(),
            });
          }
        },
        _updateUserData: async (name?: string, photo?: string) => {
          try {
            const response = await useAxios({
              url: `${API_MAIN}/profiles`,
              method: 'post',
              data: {
                name: name,
                phone: get().userData.phone,
                sid: get().userData.sid,
                birth_place: get().userData.birth_place,
                birth_date: get().userData.birth_date,
                sex: get().userData.sex,
                religion: get().userData.birth_date,
                marital_status: get().userData.marital_status,
                identity_card_photo: get().userData.identity_card_photo,
                photo: photo,
              },
            });
            console.log('res uodate profile', response);
            if (response?.status === 200) {
              set({userData: response?.data?.data, isUpdateError: false});
            }
          } catch (error) {
            // if (error?.)
            console.error('error updated', error);
            Alert.alert('Error', error?.data?.message);
            set({
              userData: {
                ...get().userData,
                full_name: get().userData.full_name,
                photo: get().userData.photo,
              },
              isUpdateError: true,
            });
          }
        },
        _onUpdateFCMToken: async (token: string) => {
          try {
            const response = await useAxios({
              url: `${API_MAIN}/tokens`,
              method: 'post',
              data: {token},
            });
            console.log('restoken', response);
            return Promise.resolve(response);
          } catch (error) {
            console.error(error);
            return Promise.reject(error);
          }
        },
        _onResetUser: () => {
          set({
            userData: {
              user_id: 0,
              full_name: '',
              email: '',
              sid: '',
              birth_place: null,
              birth_date: null,
              sex: null,
              religion_id: null,
              religion_name: null,
              marital_status: null,
              phone: '',
              identity_card_photo: '',
              photo: '',
            },
          });
        },
      }),
      {
        name: '@userState-pasiap',
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);

export default userStore;
