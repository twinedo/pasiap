import {API_MAIN} from '@env';
import zustandStorage from 'services/storage';
import {useAxios} from 'services/useAxios';
import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';

export interface IInformation {
  title: string;
  description: string;
  cover?: string;
  category: 'umum' | 'khusus';
  is_publish: boolean;
  created_at?: string;
  author_id?: number;
  author_name?: string;
  id?: number;
  slug?: string;
  updated_at?: string;
  updated_by?: number;
  updated_name?: string;
}

interface IInfoStore {
  _getInformation: () => void;
  informationList: IInformation[];
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string;
}

const informationStore = create<IInfoStore>()(
  devtools(
    persist(
      set => ({
        isLoading: false,
        informationList: [],
        _getInformation: async () => {
          set({isLoading: true, isError: false, errorMessage: ''});
          try {
            const response = await useAxios({
              url: `${API_MAIN}/articles`,
              method: 'get',
            });
            console.log('resInfo', response);

            set({isLoading: false, informationList: response?.data?.data});
          } catch (error) {
            set({
              isLoading: false,
              isError: true,
              errorMessage: error?.toString(),
            });
          }
        },
      }),
      {
        name: '@infoState-pasiap',
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);

export default informationStore;
