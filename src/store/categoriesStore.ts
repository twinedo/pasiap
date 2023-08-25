import {API_MAIN} from '@env';
import zustandStorage from 'services/storage';
import {useAxios} from 'services/useAxios';
import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';
import {ReactNode} from 'react';

export interface ICategories {
  id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
  icon: ReactNode;
  navigate?: string;
}

interface ICategStore {
  _getCategories: () => void;
  categoryList: ICategories[];
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string;
}

const categoriesStore = create<ICategStore>()(
  devtools(
    persist(
      set => ({
        isLoading: false,
        categoryList: [],
        _getCategories: async () => {
          set({isLoading: true, isError: false, errorMessage: ''});
          try {
            const response = await useAxios({
              url: `${API_MAIN}/categories`,
              method: 'get',
            });
            console.log('resCateg', response);

            set({isLoading: false, categoryList: response?.data?.data});
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
        name: '@categState-pasiap',
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);

export default categoriesStore;
