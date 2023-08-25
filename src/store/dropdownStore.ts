import {API_MAIN} from '@env';
import zustandStorage from 'services/storage';
import {useAxios} from 'services/useAxios';
import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';

interface IDataGender {
  name: string;
}

interface IDataReligion {
  id: number;
  name: string;
}

interface IDataMaritalStatus {
  name: string;
}

interface IUserStore {
  _getGenderList: () => void;
  dataGenderList: IDataGender[];
  _getReligionList: () => void;
  dataReligionList: IDataReligion[];
  _getMaritalStatusList: () => void;
  dataMaritalStatusList: IDataMaritalStatus[];
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string;
}

const dropdownStore = create<IUserStore>()(
  devtools(
    persist(
      set => ({
        isLoading: true,
        dataGenderList: [],
        dataReligionList: [],
        dataMaritalStatusList: [],
        _getGenderList: async () => {
          set({isLoading: true, isError: false, errorMessage: ''});
          try {
            const response = await useAxios({
              url: `${API_MAIN}/dropdown/sexs`,
              method: 'get',
            });
            console.log('response', response);
            set({
              isLoading: false,
              isError: false,
              errorMessage: '',
              dataGenderList: response?.data,
            });
          } catch (error) {
            set({
              isLoading: false,
              isError: true,
              errorMessage: error?.toString(),
              dataGenderList: [],
            });
          }
        },
        _getReligionList: async () => {
          set({isLoading: true, isError: false, errorMessage: ''});
          try {
            const response = await useAxios({
              url: `${API_MAIN}/dropdown/religions`,
              method: 'get',
            });
            console.log('response', response);
            set({
              isLoading: false,
              isError: false,
              errorMessage: '',
              dataReligionList: response?.data,
            });
          } catch (error) {
            set({
              isLoading: false,
              isError: true,
              errorMessage: error?.toString(),
              dataReligionList: [],
            });
          }
        },
        _getMaritalStatusList: async () => {
          set({isLoading: true, isError: false, errorMessage: ''});
          try {
            const response = await useAxios({
              url: `${API_MAIN}/dropdown/marital_status`,
              method: 'get',
            });
            console.log('response', response);
            set({
              isLoading: false,
              isError: false,
              errorMessage: '',
              dataMaritalStatusList: response?.data,
            });
          } catch (error) {
            set({
              isLoading: false,
              isError: true,
              errorMessage: error?.toString(),
              dataMaritalStatusList: [],
            });
          }
        },
      }),
      {
        name: '@dropdownState-pasiap',
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);

export default dropdownStore;
