import {ReactNode} from 'react';
import {IInformation} from 'store/informationStore';

export type RoutesParam = {
  ChangePassword: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  History: undefined;
  Information: undefined;
  InformationForm?: {params: 'add' | 'update'; data?: IInformation};
  InformationView: {data: IInformation};
  Login: undefined;
  Profile: undefined;
  Register: undefined;
  Settings: undefined;
  SOSFire: {
    data: {
      id: number;
      code: string;
      name: string;
      created_at: string;
      updated_at: string;
      icon: ReactNode;
      navigate?: string;
    };
  };
  SOSGeneral: {
    data: {
      id: number;
      code: string;
      name: string;
      created_at: string;
      updated_at: string;
      icon: ReactNode;
      navigate?: string;
    };
  };
  SOSPublic: {
    data: {
      id: number;
      code: string;
      name: string;
      created_at: string;
      updated_at: string;
      icon: ReactNode;
      navigate?: string;
    };
  };
};
