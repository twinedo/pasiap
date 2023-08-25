import {API_MAIN} from '@env';
import zustandStorage from 'services/storage';
import {useAxios} from 'services/useAxios';
import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';

export interface IReportData {
  id: number;
  category_id: number;
  category_name: string;
  reporter_id: number;
  reporter_name: string;
  handler_id?: any;
  handler_name?: any;
  lat: string;
  long: string;
  photo: string;
  description: string;
  status_id: number;
  status_name: string;
  created_at: string;
}

interface IReportStore {
  _getAllReports: () => void;
  _onResetReport: () => void;
  reportData: IReportData[];
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string;
}

const reportStore = create<IReportStore>()(
  devtools(
    persist(
      set => ({
        isLoading: false,
        reportData: [],
        _getAllReports: async () => {
          set({isLoading: true, isError: false, errorMessage: ''});
          try {
            const response = await useAxios({
              url: `${API_MAIN}/reports`,
              method: 'get',
            });
            console.log('resReportData', response);
            set({isLoading: false, reportData: response?.data?.data});
          } catch (error) {
            set({
              isLoading: false,
              isError: true,
              errorMessage: error?.toString(),
            });
          }
        },
        _onResetReport: () => {
          set({reportData: []});
        },
      }),
      {
        name: '@reportState-pasiap',
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);

export default reportStore;
