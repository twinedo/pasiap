import zustandStorage from 'services/storage';
import {WHITE} from 'styles/colors';
import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';

interface ISettingState {
  statusBarColor: string;
}
interface ISettingStore {
  changeStatusBar: (color: string) => void;
  settings: ISettingState;
}

const settingStore = create<ISettingStore>()(
  devtools(
    persist(
      set => ({
        changeStatusBar: (newColor: string) => {
          set({settings: {statusBarColor: newColor}});
        },
        settings: {
          statusBarColor: WHITE,
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
