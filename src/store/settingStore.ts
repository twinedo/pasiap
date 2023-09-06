import {API_MAIN} from '@env';
import zustandStorage from 'services/storage';
import {useAxios} from 'services/useAxios';
import {WHITE} from 'styles/colors';
import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';

interface ISettingState {
  statusBarColor: string;
}
interface ISettingStore {
  changeStatusBar: (color: string) => void;
  settings: ISettingState;
  _getFAQ: () => void;
  faqData: IFAQ[];
}

interface IFAQ {
  id: number;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

const settingStore = create<ISettingStore>()(
  devtools(
    persist(
      set => ({
        faqData: [],
        changeStatusBar: (newColor: string) => {
          set({settings: {statusBarColor: newColor}});
        },
        settings: {
          statusBarColor: WHITE,
        },
        _getFAQ: async () => {
          try {
            const response = await useAxios({
              url: `${API_MAIN}/faq`,
              method: 'get',
            });
            console.log('response faq', response);
            set({faqData: response?.data?.data});
          } catch (error) {
            console.error(error);
          }
        },
      }),
      {
        name: '@settingState-pasiap',
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);

export default settingStore;
