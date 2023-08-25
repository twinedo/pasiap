import {API_MAIN} from '@env';
import zustandStorage from 'services/storage';
import {useAxios} from 'services/useAxios';
import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';

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
  _onResetUser: () => void;
  userData: IUserData;
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string;
}

const userStore = create<IUserStore>()(
  devtools(
    persist(
      set => ({
        isLoading: false,
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
